from sqlmodel import create_engine, Session, SQLModel
from app.core.config import settings  

# SQLite file in the project root
DATABASE_URL = f"sqlite:///{settings.BASE_DIR}/database.db"

# SQLite needs this flag for multithreading
engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False},
    echo=settings.DEBUG,      # log SQL in debug mode
)

def get_session():
    with Session(engine) as session:
        yield session

