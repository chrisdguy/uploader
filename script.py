from dotenv import load_dotenv
from datetime import datetime
import pyautogui as pag
import time
import os

# File Paths
exe_path = r"C:\Users\VPS\Documents\wow\Wow.exe"
scan_path = r"C:\Users\VPS\Documents\wow\WTF\Account\MAGIC\SavedVariables\AuctionScraper.lua"

# Load .env Variables
print(f"[{datetime.now()}] Loading Environment Variables...")
load_dotenv()
password = os.getenv("ACCOUNT_PASSWORD")

while True:
    print(f"[{datetime.now()}] Launching WoW...")
    try:
        os.startfile(exe_path)
        print("Wow Started!")
        time.sleep(30)
    except Exception as e:
        print(f"[{datetime.now()}] Failed to launch WoW:", e)

    # Login
    pag.write(password, interval=0.5)
    pag.press("enter")
    time.sleep(10)
    print(f"[{datetime.now()}] Logged In!")

    # Enter Realm
    pag.press("enter")
    time.sleep(10)
    print(f"[{datetime.now()}] Entered Realm!")

    # Enter Actioneer GUI
    print(f"[{datetime.now()}] Starting Scan...")
    pag.press("1")
    time.sleep(5)
    pag.press("p")
    time.sleep(5)

    # Start Scan
    print(f"[{datetime.now()}] Scanning...")
    pag.press("2")
    time.sleep(1800)

    # Reload
    print(f"[{datetime.now()}] Scan Complete!")
    pag.press("3")
    time.sleep(5)

    # Exit
    print(f"[{datetime.now()}] Exiting!")
    pag.hotkey('alt', 'f4')
    time.sleep(10)

    # Send Scan Info to DB
    print(f"[{datetime.now()}] Data Sent!")
    os.startfile(scan_path)
