from langchain_openai import ChatOpenAI
import os
from app.services.file_service import get_file
import io
import pandas as pd
import base64
import json
import matplotlib.pyplot as plt


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class SSheetAgent:
    def __init__(self, file_id, model_name='gpt-3.5-turbo'):
        self.file_id = file_id

        self.model = ChatOpenAI(model_name=model_name, api_key=OPENAI_API_KEY)
        self.df = None
        self.answer = ""
        self.column_desc = {}

        self.df_info = {}
        self.query = ""
        self.script = ""

        self.is_debug = False

    def load_df(self):
        file = get_file(self.file_id)
        print("FILE: ", file)
        file_content = file.content.decode('utf-8', errors='replace')

        self.column_desc = json.loads(file.column_descriptions)
        
        self.df = pd.read_file(io.StringIO(file_content), header=0)
    
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

    def load_df_desc(self):

        def convert_to_native(val):
            if isinstance(val, (pd.Int64Dtype, pd.UInt64Dtype, pd.Float64Dtype, pd.Series)):
                return val.item()
            return val
            
        info = {}
        info["column_descriptions"] = self.column_desc

        info['shape'] = tuple(map(int, self.df.shape))
        info['describe'] = self.df.describe().applymap(convert_to_native).to_dict()
        info['non_null_count'] = {k: int(v) for k, v in dict(self.df.count()).items()}
        info['unique_values'] = {k: int(v) for k, v in dict(self.df.apply(lambda col: len(col.unique()))).items()}
        info['first_row'] = {k: str(v) for k, v in dict(self.df.iloc[0]).items()}
        info['last_row'] = {k: str(v) for k, v in dict(self.df.iloc[-1]).items()}

        self.df_info = info

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

        script_str = self.model.invoke(messages).content
        
        return script_str

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
            return "Sorry, I couldn't find any answer"
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


    def get_result(self, human_prompt, history):
        self.load_df()
        self.load_df_desc()

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
            

