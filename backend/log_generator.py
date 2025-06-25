import random
from datetime import datetime
from log_nlp import process_log_entry

sample_ips = ["10.0.0.1", "10.0.0.2", "192.168.1.3", "172.16.0.5"]
messages = [
    "Failed login attempt for admin",
    "Unauthorized access detected",
    "Invalid password entered by user",
    "Successful login for user root",
    "Connection established to database"
]

def generate_log_entry():
    ip = random.choice(sample_ips)
    message = random.choice(messages)
    timestamp = datetime.utcnow()
    alerts = process_log_entry(ip, message, timestamp)
    return alerts
