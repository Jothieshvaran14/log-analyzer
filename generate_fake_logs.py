import random
from datetime import datetime, timedelta

status_codes = [200]*50 + [404]*10 + [500]*5 + [403]*5 + [302]*5
methods = ["GET", "POST", "PUT", "DELETE"]
urls = ["/", "/login", "/dashboard", "/api/data", "/hello", "/favicon.ico", "/logout", "/missing", "/static/js/app.js"]
ips = ["192.168.1.1", "10.0.0.5", "::1", "172.16.254.1", "203.0.113.10", "198.51.100.22"]

now = datetime.now()

lines = []

for i in range(500):  # increase to simulate more logs
    dt = (now - timedelta(minutes=random.randint(0, 120))).strftime("%d/%b/%Y:%H:%M:%S +0530")
    ip = random.choice(ips)
    method = random.choice(methods)
    url = random.choice(urls)
    status = random.choice(status_codes)
    size = random.randint(200, 20000)

    line = f'{ip} - - [{dt}] "{method} {url} HTTP/1.1" {status} {size}'
    lines.append(line)

with open("logs/access.log", "w") as f:
    f.write("\n".join(lines))

print("✅ Fake logs generated.")

