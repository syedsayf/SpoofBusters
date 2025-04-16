from dotenv import load_dotenv
load_dotenv()

from scapy.all import sniff, IP, get_if_list, get_if_addr
from datetime import datetime
import requests
from pymongo import MongoClient
import os

# 🔄 Load environment variables from .env file
load_dotenv()

# MongoDB local backup
MONGO_HOST = 'localhost'
MONGO_PORT = 27017
MONGO_DB = 'network_data'
MONGO_COLLECTION = 'packets'

# Backend endpoint
BACKEND_ENDPOINT = 'http://localhost:5001/api/reports'

# Load token from .env
SPOOFBUSTERS_TOKEN = os.getenv("SPOOFBUSTERS_TOKEN")


# 🔌 Connect to local MongoDB
def connect_to_mongodb():
    client = MongoClient(MONGO_HOST, MONGO_PORT)
    db = client[MONGO_DB]
    return db[MONGO_COLLECTION]


# 🚀 Send data to backend and backup in MongoDB
def send_to_backend(log_data):
    headers = {
        "Authorization": f"Bearer {SPOOFBUSTERS_TOKEN}",
        "Content-Type": "application/json"
    }

    try:
        formatted_data = {
            "sourceIp": log_data["sourceIp"],              # ✅ camelCase
            "destinationIp": log_data["destinationIp"],    # ✅ camelCase
            "timestamp": datetime.utcnow().isoformat(),
            "isSpoofed": log_data["status"] == "Spoofed",
            "analysisDetails": f"Detected abnormal packet from {log_data['sourceIp']}"
        }

        res = requests.post(BACKEND_ENDPOINT, json=formatted_data, headers=headers)

        if res.status_code == 201:
            print(f"🛰️ Sent to backend: {res.status_code} ✅")
        else:
            print(f"⚠️ Backend responded with {res.status_code}: {res.text}")

    except Exception as e:
        print(f"❌ Failed to send to backend: {e}")

    try:
        collection = connect_to_mongodb()
        collection.insert_one(log_data)
        print("💾 Log inserted into local MongoDB")
    except Exception as e:
        print(f"❌ Failed to insert into MongoDB: {e}")


# 📡 Handle sniffed packets
def handle(pkt):
    if IP in pkt:
        src = pkt[IP].src
        dst = pkt[IP].dst
        now = datetime.now().strftime('%H:%M:%S')

        log_data = {
            "sourceIp": src,             # ✅ camelCase
            "destinationIp": dst,        # ✅ camelCase
            "timestamp": now,
            "status": "Legit" if src.startswith("192.168.") else "Spoofed"
        }

        if log_data["status"] == "Legit":
            print(f"[{now}] ✅ Legit packet: {src} ➝ {dst}")
        else:
            print(f"[{now}] ⚠️ Spoofed IP detected: {src} ➝ {dst}")
            send_to_backend(log_data)


# 🌐 Auto-detect interface
iface = None
for i in get_if_list():
    try:
        ip = get_if_addr(i)
        if ip.startswith("192.168."):
            iface = i
            print(f"[✔] Monitoring on: {i} ({ip})")
            break
    except Exception:
        pass

if iface is None:
    print("❌ No valid interface found.")
    exit()

# 🚦 Start sniffing
print("🎯 Monitoring spoof attempts...")
sniff(filter="ip", prn=handle, iface=iface)
