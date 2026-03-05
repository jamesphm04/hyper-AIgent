import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://username:password@localhost/db_name")
    SQLALCHEMY_TRACK_MODIFICATIONS = False