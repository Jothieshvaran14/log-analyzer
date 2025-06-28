import pandas as pd
import numpy as np
import re
from sklearn.cluster import KMeans
from sklearn.ensemble import IsolationForest
from datetime import datetime

log_file = "logs/access.log"
log_pattern = re.compile(
    r'(?P<ip>\S+) \S+ \S+ \[(?P<timestamp>[^\]]+)\] "(?P<method>\S+) (?P<url>\S+) \S+" (?P<status>\d{3}) (?P<size>\d+)$'
)

data = []
with open(log_file, "r") as f:
    for line in f:
        match = log_pattern.match(line)
        if match:
            entry = match.groupdict()
            entry["status"] = int(entry["status"])
            entry["size"] = int(entry["size"])
            entry["response_time"] = np.random.randint(10, 2000)
            data.append(entry)

df = pd.DataFrame(data)
print("Parsed DataFrame columns:", df.columns)

if df.empty:
    print("❌ No valid logs parsed. Check access.log format.")
    exit()

# Timestamp formatting
df["timestamp"] = pd.to_datetime(df["timestamp"], format="%d/%b/%Y:%H:%M:%S %z", errors="coerce")
df["timestamp"] = df["timestamp"].dt.tz_localize(None)
df["minute"] = df["timestamp"].dt.floor("min")
df["hour"] = df["timestamp"].dt.floor("h")

# ========== Component 1: Status Code Distribution ==========
status_counts = df["status"].value_counts().reset_index()
status_counts.columns = ["status", "count"]
status_counts.to_csv("status_code_distribution.csv", index=False)

# ========== Component 2: Requests Over Time ==========
requests_time = df["minute"].value_counts().sort_index().reset_index()
requests_time.columns = ["time", "count"]
requests_time.to_csv("requests_over_time.csv", index=False)

# ========== Component 3: Top URLs with KMeans ==========
url_counts = df["url"].value_counts().reset_index()
url_counts.columns = ["url", "count"]
if len(url_counts) >= 3:
    kmeans = KMeans(n_clusters=2, random_state=42)
    url_counts["cluster"] = kmeans.fit_predict(url_counts[["count"]])
    anomaly_cluster = url_counts.groupby("cluster")["count"].mean().idxmin()
    url_counts["anomaly"] = url_counts["cluster"] == anomaly_cluster
else:
    url_counts["anomaly"] = False
url_counts.to_csv("top_urls.csv", index=False)
url_counts[url_counts["anomaly"]].to_csv("url_anomaly.csv", index=False)

# ========== Component 4: Source IPs with Isolation Forest ==========
ip_counts = df["ip"].value_counts().reset_index()
ip_counts.columns = ["ip", "count"]
if len(ip_counts) >= 5:
    iso = IsolationForest(contamination=0.2, random_state=42)
    ip_counts["anomaly"] = iso.fit_predict(ip_counts[["count"]]) == -1
else:
    ip_counts["anomaly"] = False
ip_counts.to_csv("source_ips.csv", index=False)
ip_counts[ip_counts["anomaly"]].to_csv("ip_anomaly.csv", index=False)

# ========== Component 5: Slow Response Detection ==========
df["response_time"] = pd.to_numeric(df["response_time"], errors="coerce")
mean = df["response_time"].mean()
std = df["response_time"].std()
df["z_score"] = (df["response_time"] - mean) / std
df["slow"] = df["z_score"] > 2.0
df[["timestamp", "url", "response_time", "z_score", "slow"]].to_csv("slow_responses.csv", index=False)

# ========== Component 6: Anomaly Summary ==========
summary = {
    "url_anomalies": url_counts["anomaly"].sum(),
    "ip_anomalies": ip_counts["anomaly"].sum(),
    "slow_responses": df["slow"].sum()
}
pd.DataFrame([summary]).to_csv("anomaly_summary.csv", index=False)

print("✅ Log parsing and ML enrichment complete.")

