import os
import io
import json
import base64
import pandas as pd
import matplotlib.pyplot as plt
from langchain_openai import ChatOpenAI
from app.services.file_service import FileService
from app.services.sql_service import SQLService

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class AgenticService:
    def __init__(self, sql_service: SQLService, file_service: FileService, model_name='gpt-4o-mini'):
        # Global variables  
        self.model = ChatOpenAI(model_name=model_name, api_key=OPENAI_API_KEY)
        self.sql_service = sql_service
        self.file_service = file_service
        
        # Common variables
        self.dfs = None
        self.sheets_name = []
        self.column_desc = {}
        self.chat_id = None
        self.file_type = None
        self.source = None
        
        # Variables for each query
        self.df = None
        self.df_info = {}
        self.answer = ""
        self.query = ""
        self.script = ""
        self.is_debug = False

    def load_df(self, current_sheet):
        self.df = self.dfs[current_sheet]

        def convert_to_native(val):
            if isinstance(val, (pd.Int64Dtype, pd.UInt64Dtype, pd.Float64Dtype, pd.Series)):
                return val.item()
            return val
            
        info = {}
        
        column_descriptions = self.column_desc.get(current_sheet, {})
        
        info["column_descriptions"] = column_descriptions

        info['shape'] = tuple(map(int, self.df.shape))
        info['describe'] = self.df.describe().applymap(convert_to_native).to_dict()
        info['non_null_count'] = {k: int(v) for k, v in dict(self.df.count()).items()}
        info['unique_values'] = {k: int(v) for k, v in dict(self.df.apply(lambda col: len(col.unique()))).items()}
        info['first_five_rows'] = self.df.head(5).astype(str).to_dict(orient='records')
        info['last_row'] = {k: str(v) for k, v in dict(self.df.iloc[-1]).items()}

        self.df_info = info
        
    def load_file(self, chat_id, source):
        
        if self.chat_id == chat_id and self.source == source:
            print("File already loaded")
            return
        
        self.chat_id = chat_id
        self.source = source
        file_content, file_type, columns_description = self.sql_service.get_file(chat_id, source)

        if file_type == 'CSV':
            dfs = self.file_service.read_csv_file(file_content)
        else: 
            dfs = self.file_service.read_excel_file(file_content, all_sheets=True)
        
        self.file_type = file_type
        self.column_desc = columns_description
        self.dfs = dfs
        self.sheets_name = list(dfs.keys())
    
    def get_result_image(self):
        prompt = f''' 
        You are a data analyst working for a professional company. You have done analyzing a dataframe and got result.
        Given a result as a string, you need to extract the directory of the image file and return it as a string.

        Here is the result:
        Result: {self.answer}

        For example,
        Result: 'The chart is saved at **best_marketer_net_revenue.png**'
        Your should give me in short only: best_marketer_net_revenue.png. So that I can open it using with `open(image_path, "rb") in python`
        '''

        messages = [
            ("system", f"{prompt}"),
        ]

        image_path = self.model.invoke(messages).content

        print("IMAGE PATH: ", image_path)

        try:
            with open(image_path, "rb") as image_file:
                # Read the image file and encode it to Base64
                encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
                return encoded_image
        except Exception as e:
            print(f"Error loading image: {e}")
            return None


    def get_script(self, human_prompt, history):
        system_prompt = f"""
            You are a data analyst working for a professional company. You have been given a dataset with the following information:
            
            {self.df_info}
            
            This is the history of the conversation:
            {history}

            Your job is to analyze the dataset by writing a Python script and following these rules. 
            Rules: 
            1. Just give me a python with imports and a function to run on itself
            2. Do not have ```python```.
            2. Be able to call exec(content) straight away.
            3. Execute it and return an answer as a string if needed 
            4. Return saved chart directory if needed
            5. What ever you return, save it as variable name "answer"
            6. Remember to use matplotlib.use("Agg") before using plt.figure()


            Your script should look like this without ```python```:
            import pandas as pd
            import matplotlib.pyplot as plt
            matplotlib.use("Agg")
            def analyze_data(df):
                ...preprocess... because this df is loaded as file, all of them are string
                plt.figure()
                plt.title('Net Revenue Distribution')
                
                chart_dir = 'sales_distribution_pie_chart.png'
                plt.savefig(chart_dir)

                return char_dir or return str(answer)

            answer = analyze_data(df)

            Assuming the dataset is provided as "df"
            Again, remember to return the answer as a string only, either as a plot directory or an answer.
            Here is the instruction in: 
        """

        messages = [
        (
            "system",
            f"{system_prompt}",
        ),
        ("human", f"{human_prompt}"),
        ]
        
        print("MESSAGES: ", messages)

        script_str = self.model.invoke(messages).content
        
        return script_str
    
    def get_sheet_name(self, human_prompt):
        system_prompt = f"""
            You are a data analyst working for a professional company.
            You have been given an spreadsheet in Excel format.
            Here is the list of available sheets in the spreadsheet and its description:
            {self.sheets_name}
            
            Your job is to decide which sheet to analyze by returning the sheet name.
            Rules:
            1. Return the sheet name as a exact string, without any quotes or other characters.
            2. The sheet name should be one of the available sheet names
            3. The sheet name should be EXACLTY the same as the one in the spreadsheet.
            4. Just the sheet name, no other information needed, qoutes, or anything else. JUST THE SHEET NAME.
        """

        messages = [
        (
            "system",
            f"{system_prompt}",
        ),
        ("human", f"{human_prompt}"),
        ]
        
        return self.model.invoke(messages).content
        

    def exec_script(self, human_prompt, history="", attempt=1, max_attempts=3):
        script = self.get_script(human_prompt, history)

        self.script = script

        print(f"Attempt {attempt}:")
        print(script)

        try: 
            # Create a namespace with required imports and the DataFrame
            namespace = {
                'pd': pd,
                'plt': plt,
                'df': self.df
            }
            
            # Execute the script in the prepared namespace
            exec(script, namespace)

            # Retrieve the result from the namespace
            self.answer = str(namespace.get('answer', ''))

        except Exception as e:
            print(f"Error on attempt {attempt}: {e}")
            
            if attempt < max_attempts:
                human_prompt_with_error = f'''
                Previous instruction:
                {human_prompt}

                With this script:
                {script}
                You got this error:
                {e}
                
                Please correct the error and try again.
                '''
                # Retry with the updated prompt and increment the attempt count
                self.exec_script(human_prompt_with_error, attempt + 1, max_attempts)
            else:
                msg = f"Max attempts reached. Could not resolve the error: {e}"
                print(msg)
                self.answer = msg

    def gen_friendly_answer(self):
        if self.answer == "":
            return "Sorry, I couldn't find any answer. Could you please be more specific?"
        else:
            prompt = f'''
            You are a data analyst working for a professional company. You have done analyzing a dataframe and got result.

            1. Query: 
            {self.query}
            2. Coding script:
            {self.script}
            3. Result after running the script:
            {self.answer}

            Reformulate the result in a friendly using those three information. Do not mention the image dir anymore. Use formal language.
            '''
            messages = [
                ("system", f"{prompt}"),
            ]

            return self.model.invoke(messages).content

    def run(self, chat_id, human_prompt, history, source):
        self.load_file(chat_id, source)
        
        chosen_sheet_name = None
        if self.file_type == 'CSV':
            chosen_sheet_name = 'csv_default_sheet_name'
        else: 
            chosen_sheet_name = self.get_sheet_name(human_prompt)
            
        print("CHOSEN SHEET NAME: ", chosen_sheet_name)
        self.load_df(chosen_sheet_name)
        
        

        if human_prompt.startswith("DEBUG::"):
            human_prompt = human_prompt.replace("DEBUG::", "")
            print("DEBUG MODE")
            self.is_debug = True
        else:
            self.is_debug = False
        print("HUMAN PROMPT: ", human_prompt)

        self.query = human_prompt

        self.exec_script(human_prompt, history)

        print("FINAL ANSWER: ", self.answer)

        friendly_answer = self.gen_friendly_answer()

        if self.is_debug:
            friendly_answer = f''' 
            {friendly_answer}
            SCRIPT:
            {self.script}
            '''

        print("FRIENDLY ANSWER: ", friendly_answer)

        result = {
            "answer": friendly_answer,
            "image": None,
            "remove_img_path": None,
            "script": self.script
        }

        if any(ext in self.answer for ext in ['png', 'jpg', 'jpeg']):
            print("Image found......")
            result['image'] = self.get_result_image()
            result['remove_img_path'] = self.answer

        return result