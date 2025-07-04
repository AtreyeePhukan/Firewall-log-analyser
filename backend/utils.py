import re
import pandas as pd
from fastapi import FastAPI, WebSocket, UploadFile, File


def parse_log_line(line):
    parts = line.split(" ", 2)
    if len(parts) < 3:
        raise ValueError("Invalid log format")
    return parts[0], parts[1], parts[2]

# def logs_to_dataframe(lines):
#     logs = []
#     for line in lines:
#         try:
#             ip, timestamp, message = parse_log_line(line)
#             logs.append({
#                 "IP_Address": ip,
#                 "Timestamp": timestamp,
#                 "Log_Type": extract_type(message),
#                 "Severity": extract_severity(message)
#             })
#         except Exception as e:
#             print(f"Skipping bad log: {line}\n{e}")
#             continue
#     return pd.DataFrame(logs)
from fastapi import UploadFile
import pandas as pd

def logs_to_dataframe(file) -> tuple[pd.DataFrame, pd.DataFrame]:

    content = file.file.read().decode('utf-8').splitlines()

    rows = [line.strip().split(' ', 2) for line in content if line.strip()]
    df_raw = pd.DataFrame(rows, columns=['IP_Address', 'Timestamp', 'Message'])

    df_raw['Log_Type'] = df_raw['Message'].apply(lambda x: x.split(' ')[0] if x else 'system')
    df_raw['Severity'] = df_raw['Message'].apply(lambda x: x.split(' ')[1] if len(x.split()) > 1 else 'info')

    df_transformed = pd.DataFrame({
        'Log comp': df_raw['Log_Type'],
        'Log subtype': df_raw['Severity'],
        'Firewall rule': ['rule1'] * len(df_raw),
        'Firewall rule name': ['default'] * len(df_raw),
        'NAT rule': ['nat1'] * len(df_raw),
        'NAT rule name': ['nat_default'] * len(df_raw),
        'In interface ': ['eth0'] * len(df_raw),
        'Out interface ': ['eth1'] * len(df_raw),
        'Src IP': df_raw['IP_Address'],
        'Dst IP': ['192.168.1.1'] * len(df_raw),
        'Src port': [1234] * len(df_raw),
        'Dst port': [80] * len(df_raw),
        'protocol': ['TCP'] * len(df_raw),
        'Rule type': ['allow'] * len(df_raw),
        'Live PCAP': ['false'] * len(df_raw),
        'Log occurrence': [1] * len(df_raw),
    })

    return df_transformed, df_raw

def extract_type(msg):
    if "login" in msg:
        return "login"
    elif "error" in msg:
        return "error"
    elif "fail" in msg:
        return "fail"
    return "other"

def extract_severity(msg):
    msg = msg.lower()
    if "critical" in msg:
        return "high"
    elif "error" in msg or "fail" in msg:
        return "medium"
    else:
        return "low"
