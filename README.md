# Epoch Auction House Uploader

This script is designed to parse and upload auction house data from the in-game `AuctionScraper` addon to the Epoch Auction House server.

It reads the `AuctionScraper.lua` file, converts the Lua table data to JSON, and sends it to a specified API endpoint.

## Prerequisites

  * Node.js (version 20+)
  * An `AuctionScraper.lua` data file, which can be obtained from the [AuctionScraper](https://github.com/magic62/AuctionScraper) addon.

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
    node upload.js AuctionScraper.lua
    ```

## Building from Source
If you prefer to create a standalone executable (.exe) that doesn't require Node.js to be installed on the machine you run it on, you can build it from the source files with the following command

    npm run build

Once the build is complete, you will find a dist folder. Inside this folder will be your executable file.

You can now run this .exe file from the command line, passing the path to your Lua file as an argument, just like before.

    .\dist\convert.exe "C:\Path\To\Your\AuctionScraper.lua"