# Listing Monitor  

A robot that help help you watch your interested listing.

## Description

Let say you are looking for a house to rent, and there are a lot of possible house locations and types you want to look for the listing on the internet, If you do not have enough time to go through all that, this is a bot that helps you to watch the link of your desired listing, and notify you if there is a new listing posted. 

This program use Playwright libraries to browse through listing website to read the listing details, and write into local sqlite database. The browsing is done reponsibly, by using random delay between next query and can be configured using shell command to run periodically, for example, every 2 hours (see `Dockerfile`).

With the helps of Telegram bot API, a bot will send you a message to you and you just need to click the listing in the chat to view the listing.

![Description image](https://github-production-user-asset-6210df.s3.amazonaws.com/74431455/514764147-7f4816fa-7f3c-42f4-ab12-49ce35e13d3e.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20251115%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251115T134501Z&X-Amz-Expires=300&X-Amz-Signature=28741f3eb230675541264c31fe0b99f746bec5c0226a2297e52770ed226e885e&X-Amz-SignedHeaders=host)

## Getting Started

### Prerequisites

* Node.js, Playwright
* Optional: Docker

### Installing

* How/where to download your program
* Any modifications needed to be made to files/folders

1. Installing the packages
    ```bash
    npm install
    ```
2. Installing Playwright
    ```bash
    npx playwight install
    ```
3. Create a telegram bot
    * In the telegram apps, search for `@BotFather`.
    * Start a chat by sending the command `/start`.
    * Create a new bot by sending the command `/newbot`.
    * Input a desired name for the bot
    * Input a desired username for the bot
    * Botfather will send you the API token. Save this token securely.
4. Get a chat ID
    * You can choose whether you want the bot to directly send a message to your chat, or thourgh a group. 
    * Go to `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
    * In your chat/group, send `/start`.
    * Retrieve the chat ID from the link.

### Executing program

1. To build the code
    ```bash
    npm run build
    ```
2. To execute the code
    ```bash
    npm dist/mudah-monitor.js
    ```