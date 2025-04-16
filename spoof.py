from flask import Flask, jsonify, Response
from flask_cors import CORS
from scapy.all import sniff, IP, get_if_list, get_if_addr
from datetime import datetime
import requests
import json
from pymongo import MongoClient
from bson import ObjectId
from threading import Thread
import time
import os
import sys

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

# MongoDB connection details
MONGO_HOST = 'localhost'
MONGO_PORT = 27017
MONGO_DB = 'network_data'
MONGO_COLLECTION = 'packets'

# Global variables for scan control
is_scanning = False
scan_results = []
scan_error = None

# Custom JSON encoder for MongoDB ObjectId serialization
class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

def connect_to_mongodb():
    try:
        client = MongoClient(MONGO_HOST, MONGO_PORT)
        db = client[MONGO_DB]
        return db[MONGO_COLLECTION]
    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        return None

def handle_packet(pkt):
    if IP in pkt and is_scanning:
        src = pkt[IP].src
        dst = pkt[IP].dst
        now = datetime.now().strftime('%H:%M:%S')

        # Use only primitive types for data that will be stored and returned
        log_data = {
            "sourceIp": src,
            "destinationIp": dst,
            "timestamp": now,
            "status": "Legit" if src.startswith("192.168.") else "Spoofed"
        }

        if log_data["status"] == "Spoofed":
            print(f"[{now}] ⚠️ Spoofed IP detected: {src} ➝ {dst}")
            scan_results.append(log_data)
            try:
                collection = connect_to_mongodb()
                if collection is not None:  # Correct way to check for None
                    collection.insert_one(log_data)
                    print("💾 Log inserted into MongoDB")
            except Exception as e:
                print(f"❌ Failed to insert into MongoDB: {e}")

def start_scan():
    global is_scanning, scan_results, scan_error
    scan_results = []
    scan_error = None
    is_scanning = True
    
    # Auto-detect interface
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
        scan_error = "No valid interface found"
        is_scanning = False
        return False, scan_error

    # Start packet capture in a separate thread
    def capture():
        global is_scanning, scan_error
        try:
            sniff(filter="ip", prn=handle_packet, iface=iface, timeout=10)
        except PermissionError as e:
            scan_error = "Permission denied: This script must be run with sudo/administrator privileges"
            print(f"❌ Error: {scan_error}")
            print("⚠️ Run the script with: sudo python3 spoof.py")
        except Exception as e:
            scan_error = str(e)
            print(f"❌ Error during scanning: {e}")
        finally:
            is_scanning = False

    Thread(target=capture).start()
    return True, "Scan started successfully"

@app.route('/api/scan/start', methods=['POST'])
def start_scan_api():
    success, message = start_scan()
    resp_data = {"status": "success" if success else "error", "message": message}
    return Response(
        json.dumps(resp_data, cls=MongoJSONEncoder),
        status=200 if success else 500,
        mimetype='application/json'
    )

@app.route('/api/scan/status', methods=['GET'])
def scan_status():
    # Create response data
    resp_data = {
        "isScanning": is_scanning,
        "results": scan_results,  
        "error": scan_error
    }
    
    # Use our custom encoder for ObjectId serialization
    return Response(
        json.dumps(resp_data, cls=MongoJSONEncoder),
        status=200,
        mimetype='application/json'
    )

@app.route('/api/scan/results', methods=['GET'])
def get_results():
    # Simply return the current scan results
    return Response(
        json.dumps(scan_results, cls=MongoJSONEncoder),
        status=200,
        mimetype='application/json'
    )

def check_privileges():
    # Check if the script is running with root/admin privileges
    if os.name == 'posix':  # Unix/Linux/macOS
        if os.geteuid() != 0:
            print("⚠️ Warning: This script needs to be run with sudo privileges to capture packets")
            print("⚠️ Please run: sudo python3 spoof.py")
            return False
    # For Windows, could implement UAC check here if needed
    return True

if __name__ == '__main__':
    # Print startup banner
    print("=" * 60)
    print("🛡️  SpoofBusters Network Scanner")
    print("=" * 60)
    
    # Check privileges
    check_privileges()
    
    # Start Flask app
    print(f"🚀 Starting API server on port 5002")
    app.run(host='0.0.0.0', port=5002)
