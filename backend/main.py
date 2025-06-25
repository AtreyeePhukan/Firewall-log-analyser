import joblib
import pandas as pd
from fastapi import FastAPI, UploadFile, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import traceback
import numpy as np
from log_simulator_runner import log_simulation_loop, clients
import asyncio

from utils import logs_to_dataframe
from database import (
    create_logs_table,
    insert_log,
    get_table_data,
    get_chart_data,
    get_line_chart_data,
    get_bar_chart_data,
    get_donut_chart_data,
    update_dashboard_metrics,      
    get_latest_dashboard_metrics     
)

model_bundle = joblib.load("models/anomaly_model_bundle.pkl")
model = model_bundle["model"]
columns = model_bundle["columns"]
encoders = model_bundle["encoders"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await create_logs_table()

def safe_label_encode(encoder, series):
    classes = set(encoder.classes_)
    new_labels = set(series.unique()) - classes
    if new_labels:
        encoder.classes_ = np.append(encoder.classes_, list(new_labels))
    return encoder.transform(series)

@app.post("/upload/")
async def upload_logs(file: UploadFile):
    try:
        df_encoded, df_raw = logs_to_dataframe(file)

        from sklearn.preprocessing import LabelEncoder

        for col in columns:
            if df_encoded[col].dtype == object:
                if col in encoders:
                    df_encoded[col] = safe_label_encode(encoders[col], df_encoded[col].astype(str))
                else:
                    print(f"⚠️ Auto-encoding missing column: {col}")
                    le = LabelEncoder()
                    df_encoded[col] = le.fit_transform(df_encoded[col].astype(str))

        df_encoded = df_encoded[columns]

        predictions = model.predict(df_encoded)

        from datetime import datetime

        for i, row in df_raw.iterrows():
            timestamp = row["Timestamp"]
            if isinstance(timestamp, str):
                try:
                    timestamp = datetime.fromisoformat(timestamp)
                except ValueError:
                    timestamp = datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S")

            await insert_log(
                row["IP_Address"],
                timestamp,
                f"{row['Log_Type']} - {row['Severity']}",
                bool(predictions[i] == -1)
            )

        active_users = df_raw["IP_Address"].nunique()
        events_per_minute = len(df_raw) // 10
        alerts = int(sum(predictions == -1))
        await update_dashboard_metrics(active_users, events_per_minute, alerts)

        return {
            "lineData": await get_line_chart_data(),
            "barData": await get_bar_chart_data(),
            "donutData": await get_donut_chart_data(),
            # "logs": await get_chart_data(),
            "logs": await get_table_data(), 
        }

    except Exception as e:
        print(f"❌ Upload error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Log upload failed.")

@app.get("/charts/line")
async def get_line_data():
    return await get_line_chart_data()

@app.get("/charts/bar")
async def get_bar_data():
    return await get_bar_chart_data()

@app.get("/charts/donut")
async def get_donut_data():
    return await get_donut_chart_data()

# @app.get("/logs")
# async def fetch_logs():
#     return await get_table_data()


@app.websocket("/ws/dashboard")
async def dashboard_ws(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connected")
    try:
        while True:
            metrics = await get_latest_dashboard_metrics()  
            await websocket.send_json(metrics)
            await asyncio.sleep(10)
    except Exception as e:
        print("WebSocket closed:", e)

@app.get("/metrics/")
async def fetch_metrics():
    return await get_latest_dashboard_metrics()



@app.websocket("/ws/activity")
async def websocket_activity(websocket: WebSocket):
    await websocket.accept()
    clients.add(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        clients.discard(websocket)

@app.on_event("startup")
async def startup():
    await create_logs_table()
    asyncio.create_task(log_simulation_loop()) 