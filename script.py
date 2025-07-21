from dotenv import load_dotenv
import pyautogui as pag
import time
import os

# File Paths
exe_path = r"C:\Users\VPS\Documents\wow\Wow.exe"
scan_path = r"C:\Users\VPS\Documents\wow\WTF\Account\MAGIC\SavedVariables\AuctionScraper.lua"

# Load .env Variables
print("Loading Environment Variables...")
load_dotenv()
password = os.getenv("ACCOUNT_PASSWORD")

while True:
    print("Launching WoW...")
    try:
        os.startfile(exe_path)
        print("Wow Started!")
        time.sleep(10)
    except Exception as e:
        print("Failed to launch WoW:", e)

    # Login
    pag.typewrite(password, interval=0.1)
    pag.press("enter")
    time.sleep(5)
    print("Logged In!")

    # Enter Realm
    pag.press("enter")
    time.sleep(5)
    print("Entered Realm!")

    # Enter Actioneer GUI
    print("Starting Scan...")
    pag.press("1")
    time.sleep(1)
    pag.press("p")
    time.sleep(1)

    # Start Scan
    print("Scanning...")
    pag.press("2")
    time.sleep(1800)

    # Reload
    print("Scan Complete")
    pag.press("3")
    time.sleep(5)

    # Exit
    print("Exiting")
    pag.press("4")
    time.sleep(10)

    # Send Scan Info to DB
    os.startfile(scan_path)
