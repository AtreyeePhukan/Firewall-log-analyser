import joblib
import pandas as pd

bundle = joblib.load("models/anomaly_model_bundle.pkl")
model = bundle["model"]
trained_columns = bundle["columns"]
encoders = bundle["encoders"]

def safe_label_encode(encoder, series):
    """Use trained encoder. Unknown values get -1."""
    classes = encoder.classes_.tolist()
    return series.map(lambda val: encoder.transform([val])[0] if val in classes else -1)

def predict_log_vectorized(df):
    df_encoded = df.copy()

    df_encoded = df_encoded.drop(columns=['Unnamed: 19', 'Username', 'Message'], errors='ignore')
    df_encoded = df_encoded.dropna()

 
    for col in df_encoded.columns:
        if df_encoded[col].dtype == object or col in encoders:
            if col in encoders:
                df_encoded[col] = safe_label_encode(encoders[col], df_encoded[col].astype(str))
            else:
                print(f"⚠️ Skipping unknown column: {col}")
                df_encoded.drop(columns=[col], inplace=True)

 
    df_encoded = df_encoded.reindex(columns=trained_columns, fill_value=0)

    predictions = model.predict(df_encoded)
    return predictions


