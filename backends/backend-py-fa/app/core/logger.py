import logging
import sys
from datetime import datetime
from typing import Dict
import json

class CustomFormatter(logging.Formatter):
    COLORS: Dict[str, str] = {
        'DEBUG': '\033[36m',    # Cyan
        'INFO': '\033[32m',     # Green
        'WARNING': '\033[33m',  # Yellow
        'ERROR': '\033[31m',    # Red
        'CRITICAL': '\033[41m', # Red background
        'RESET': '\033[0m'      # Reset
    }

    def format(self, record: logging.LogRecord) -> str:
        # Add timestamp
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Format the message
        if isinstance(record.msg, dict):
            record.msg = json.dumps(record.msg)
            
        # Add colors for console output
        level_color = self.COLORS.get(record.levelname, '')
        reset_color = self.COLORS['RESET']
        
        # Create the log message
        log_message = f"{timestamp} | {level_color}{record.levelname}{reset_color} | {record.msg}"
        
        # Add extra data if available
        if hasattr(record, 'extra_data'):
            log_message += f"\nExtra Data: {json.dumps(record.extra_data, indent=2)}"
            
        return log_message

class Logger:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize_logger()
        return cls._instance
    
    def _initialize_logger(self):
        self.logger = logging.getLogger('app')
        self.logger.setLevel(logging.DEBUG)
        
        # Console Handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(CustomFormatter())
        self.logger.addHandler(console_handler)
        
        # File Handler
        file_handler = logging.FileHandler(
            f"logs/app-{datetime.now().strftime('%Y-%m-%d')}.log"
        )
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s | %(levelname)s | %(message)s'
        ))
        self.logger.addHandler(file_handler)
    
    def info(self, message: str, extra: dict = None):
        self._log('info', message, extra)
    
    def error(self, message: str, extra: dict = None):
        self._log('error', message, extra)
    
    def warning(self, message: str, extra: dict = None):
        self._log('warning', message, extra)
    
    def debug(self, message: str, extra: dict = None):
        self._log('debug', message, extra)
    
    def _log(self, level: str, message: str, extra: dict = None):
        log_func = getattr(self.logger, level)
        if extra:
            log_func(message, extra={'extra_data': extra})
        else:
            log_func(message)

logger = Logger()