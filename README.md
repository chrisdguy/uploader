# Project Epoch Auction House Uploader

This script is designed to parse and upload auction house data from the in-game `AuctionScraper` addon to the Epoch Auction House server.

It reads the `AuctionScraper.lua` file, converts the Lua table data to JSON, and sends it to a specified API endpoint.

## Prerequisites

  * Node.js (version 20+)
  * An `AuctionScraper.lua` data file, which can be obtained from the [AuctionScraper](https://github.com/epoch-gold/AuctionScraper) addon.

## Setup

1.  **Clone the repository:**

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env` in the root of the project directory and add the following lines:

    ```env
    API_ENDPOINT= # POST endpoint to upload scans to
    API_KEY= # API key to send with the upload
    ```

## Usage

1.  **Locate Your Auction Data:**
    Find your `AuctionScraper.lua` file. It is typically located in your World of Warcraft `SavedVariables` folder.

2.  **Run the Uploader:**
    Execute the script via the command line, providing the full path to your `AuctionScraper.lua` file as an argument.

    ```bash
    node convert.js AuctionScraper.lua
    ```

## Building from Source
If you prefer to create a standalone executable (.exe) that doesn't require Node.js to be installed on the machine you run it on, you can build it from the source files with the following command

    npm run build

Once the build is complete, you will find a dist folder. Inside this folder will be your executable file.

You can now run this .exe file from the command line, passing the path to your Lua file as an argument, just like before.

    .\dist\convert.exe "C:\Path\To\Your\AuctionScraper.lua"

# The Script

This Python script automates the process of launching World of Warcraft, logging into your account, performing an in-game scan, and exporting the results.

---

## 📦 Requirements

* Python 3.8+
* Powershell Scripts Enabled
* World of Warcraft 3.3.5a Client
* The `uploader.exe` that you just built
* A `requirements.txt` file is included.

In the uploader directory, create a venv and activate it:

   ```bash
   python -m venv .venv
   ```
   ```bash
   ./.venv/Scripts/activate
   ```
   
Install dependencies using:

   ```bash
   pip install -r requirements.txt
   ```

---

## ⚙️ Setup

1.**Download the [AuctionScraper](https://github.com/epoch-gold/AuctionScraper) addon and place it in ```Client\Interface\Addons```**

2. **Launch your wow client and login to the account you wish to use. (Make sure you check the "Remember account name" checkbox)**

3. **Create a character and move them to Auctioneer Jaxon in Stormwind**

4. **Bind your "Interact with Target" keybind to "P".**

5. **Make 3 macros and assign them to the action bar in this order:**
   1. ```/target Auctioneer Jaxon```
   2. ```/scan```
   3. ```/reload```

6. **Run a partial scan using ```/scan``` and then exit the client.**

7. **Navigate to ```Client\WTF\Account\NAME\SavedVariables```, right-click ```AuctionScraper.lua```, hover over "Open with" and click "Choose another app" browse for the ```uploader.exe``` and click "Always".**

8. **Create a `.env` file in the uploader directory with the following contents:**

   ```dotenv
   ACCOUNT_PASSWORD=your_wow_password
   EXE_PATH=C:\Path\To\Wow.exe
   SCAN_PATH=C:\Path\To\AuctionScraper.lua
   ```
   *The Scan will be located in ```Client\WTF\Account\NAME\SavedVariables```.

## Run the Script
You can now run the script by running the ```run-script.bat``` file!

## 📝 Script Behavior

The script will:

1. Load environment variables.
2. Launch the WoW client.
3. Enter your password and log in.
4. Enter the realm.
5. Interact with the Auctioneer (or similar interface).
6. Wait for the scan to complete (30 minutes).
7. Reload the UI and exit the game.
8. Send the results to the Database.

---

## ⚠️ Important Notes

* **Do not move the mouse or type during execution** – `pyautogui` simulates user input and expects a stable desktop environment.
* Make sure your screen resolution and in-game settings are consistent for keypresses to work correctly.
* Run locally or in a desktop environment with GUI (not headless).
* If running over RDP, endure to patch your Wow.exe with [WowRdpPatcher](https://github.com/Jnnshschl/WowRdpPatcher)

