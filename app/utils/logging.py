import logging
from logging.handlers import RotatingFileHandler
import os

def setup_logging():
    """Setup logging configuration"""
    log_level = logging.INFO if os.getenv("DEBUG", "False").lower() == "true" else logging.WARNING

    # Create logs directory if it doesn't exist
    os.makedirs("logs", exist_ok=True)

    # Setup rotating file handler
    file_handler = RotatingFileHandler(
        "logs/tai_backend.log",
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )

    # Setup console handler
    console_handler = logging.StreamHandler()

    # Setup formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)

    # Setup root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    root_logger.addHandler(file_handler)
    root_logger.addHandler(console_handler)

    return root_logger