import os 
from dotenv import load_dotenv
from urllib.parse import urlparse
import psycopg2
import psycopg2.extras
import json
from gspread.client import Client
from io import BytesIO
import pandas as pd

load_dotenv()

class SQLService:
    def __init__(self):
        url = urlparse(os.getenv("DATABASE_URL"))
        print(url)
        self.connection = psycopg2.connect(
            dbname=url.path[1:],
            user=url.username,
            password=url.password,
            host=url.hostname,
            port=url.port
        )
        
        self.cursor = self.connection.cursor()
        
    def close(self):
        """Close the cursor and connection."""
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
            
    def get_file(self, chat_id, source="files"):
        """
        Retrieve file content, file type, column description from the db
        
        Parameters:
        chat_id (int): The ID of the corresponding chat to retrieve
        source (str): The source of the file gg_sheets or files
        
        Returns:
        bytes: The file content as bytes
        str: The file type
        dict: The column description as a dictionary
        """
        try:
            oid = None
            file_type = None
            column_descriptions = None
            
            if source == 'files':
                query = """
                SELECT content, type, column_descriptions
                FROM files
                WHERE chat_id = %s;
                """

                self.cursor.execute(query, (chat_id,))
                result = self.cursor.fetchone()
                oid = result[0]
                file_type = result[1]
                column_descriptions_str = result[2]
            else:
                query = f"""
                SELECT content, column_descriptions
                FROM gg_sheets
                WHERE chat_id = %s;
                """
                
                self.cursor.execute(query, (chat_id,))
                result = self.cursor.fetchone()
                oid = result[0]
                file_type = 'XLSX'
                column_descriptions_str = result[1]    
            
            # Open a large object instance
            lobj = self.connection.lobject(oid, 'rb')
            
            # Read the file content
            file_content = lobj.read()
            
            # Parse column descriptions string to dictionary
            column_descriptions = json.loads(column_descriptions_str) if column_descriptions_str else {}
            
            return file_content, file_type, column_descriptions
            
        except Exception as e:
            print(e)
            return None, None, None
        
    def save_excel_file(self, file_id, excel_content):
        try:
            lobj = self.connection.lobject(0, 'wb')
            lobj.write(excel_content)
            oid = lobj.oid

            # Update the file's OID in the database
            query = """
                UPDATE files
                SET content = %s, updated_at = NOW()
                WHERE id = %s;
            """
            self.cursor.execute(query, (oid, file_id))

            # Commit the changes
            self.connection.commit()
        except Exception as e:
            print(f"Error saving DataFrames to database: {e}")
            self.connection.rollback()  # Ensure the transaction is rolled back to reset the state

        finally:
            # Always clean up resources, regardless of success or failure
            if 'lobj' in locals():
                lobj.close()
                
    def save_gg_sheet_by_url(self, url, gg_client: Client, chat_id):
        try: 
            sh = gg_client.open_by_url(url)
            
            title = sh.title
            type = 'gg_sheets'
            
            # Combine all the worksheets into a single excel file
            excel_buffer = BytesIO()
            column_description = {}
            
            with pd.ExcelWriter(excel_buffer, engine='openpyxl') as writer:
                for ws in sh.worksheets():
                    data = ws.get_all_values()
                    df = pd.DataFrame(data[1:], columns=data[0])
                    df.to_excel(writer, sheet_name=ws.title, index=False)
                    
                    column_description[ws.title] = {col: "" for col in df.columns}
                    
            excel_buffer.seek(0)
            gg_sheet_content =  excel_buffer.read()
            
            # Save the column descriptions as a JSON string
            column_descriptions_str = json.dumps(column_description)

            #DEBUG
            print("Title: ", title)
            print("URL: ", url)
            print("Column descriptions: ", column_descriptions_str)
            # print("GG sheet content: ", gg_sheet_content)
            print("Chat ID: ", chat_id)
            
            saved_id = self.save_gg_sheet_content_to_db(title, url, column_descriptions_str, gg_sheet_content, chat_id)
            message = "Success saving Google Sheet"
            
            return saved_id, title, type, message
        except Exception as e:
            print(f"Error saving Google Sheet: {e}")
            return None, None, None, str(e)
                
    def save_gg_sheet_content_to_db(self, name, url, column_descriptions, content, chat_id):
        try:
            lobj = self.connection.lobject(0, 'wb')
            lobj.write(content)
            oid = lobj.oid

            # Insert the file's OID in the database
            query = """
                INSERT INTO gg_sheets ( name, url, column_descriptions, content, chat_id, created_at)
                VALUES (%s, %s, %s, %s, %s, NOW())
                RETURNING id;
            """
            self.cursor.execute(query, (name, url, column_descriptions, oid, chat_id))
            saved_id = self.cursor.fetchone()[0]
            
            # Commit the changes
            self.connection.commit()
            
            return saved_id
            
        except Exception as e:
            print(f"Error saving DataFrames to database: {e}")
            self.connection.rollback()
            return None
        
    def test_sql_query(self, query):
        try:
            self.cursor.execute(query)
            result = self.cursor.fetchall()
            return result
        except Exception as e:
            print(e)
            return None