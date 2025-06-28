from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI()

# Allow all origins (for local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_PATH = os.path.dirname(os.path.abspath(__file__))

def read_csv(filename):
    try:
        path = os.path.join(BASE_PATH, filename)
        df = pd.read_csv(path)
        return df.to_dict(orient="records")
    except Exception as e:
        return {"error": f"Could not load {filename}", "detail": str(e)}

@app.get("/status-code-distribution")
def get_status_codes():
    return read_csv("status_code_distribution.csv")

@app.get("/requests-over-time")
def get_requests():
    return read_csv("requests_over_time.csv")

@app.get("/top-urls")
def get_top_urls():
    return read_csv("top_urls.csv")

@app.get("/source-ips")
def get_ips():
    return read_csv("source_ips.csv")

@app.get("/slow-responses")
def get_slow():
    return read_csv("slow_responses.csv")

@app.get("/anomaly-summary")
def get_summary():
    return read_csv("anomaly_summary.csv")

