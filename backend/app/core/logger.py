# app/core/logger.py
import logging
from logging.handlers import RotatingFileHandler
from app.core.config import settings

# Create a logger 
logger = logging.getLogger(settings.APP_NAME)
logger.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)

# Define formatter
formatter = logging.Formatter(
    fmt="%(asctime)s %(levelname)-8s [%(name)s:%(lineno)d] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# Console handler
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# File handler with rotation
# file_handler = RotatingFileHandler(
#     filename="logs/app.log",    
#     maxBytes=10 * 1024 * 1024,    # 10 MB
#     backupCount=5,
# )
# file_handler.setFormatter(formatter)
# logger.addHandler(file_handler)

# from app.core.logger import logger

