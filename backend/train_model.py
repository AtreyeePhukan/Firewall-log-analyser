import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder
import joblib
import os

df = pd.read_csv("generated_balanced_logs.csv")
df = df.drop(columns=['Unnamed: 19', 'Username', 'Message', 'Time'], errors='ignore')  
df = df.dropna()

df_encoded = df.copy()
encoders = {}
for col in df_encoded.select_dtypes(include='object').columns:
    enc = LabelEncoder()
    df_encoded[col] = enc.fit_transform(df_encoded[col])
    encoders[col] = enc

model = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
model.fit(df_encoded)

os.makedirs("models", exist_ok=True)
joblib.dump({
    "model": model,
    "columns": df_encoded.columns.tolist(),
    "encoders": encoders
}, "models/anomaly_model_bundle.pkl")

print("Model trained and saved. Columns:", df_encoded.columns.tolist())
