import {config} from 'dotenv';

import ListingDB, {Listing} from "./db/db";
import ScrapListings  from "./scrapper/scrapListings";
import TelegramNotifier from "./telegram/telegram";
import { loadUrlConfig } from './utils/urlLoader';

//dummy change
// load Url to search
const {searchUrls: MUDAH_URL} = loadUrlConfig();

// load .env file
config();
if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    throw new Error('Missing required environment variables');
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const telegram = new TelegramNotifier(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID);

const DB_FILE = process.env.DB_FILE || "listing.db";
const db=new ListingDB(DB_FILE);

function insertNewListings(listings: Listing[]) {
    return db.insertMany(listings);
};

function getNewListings() {
    return db.getLatest(20);
}

// === MAIN ===

(async () => {
    console.log("🔍 Checking Mudah.my...");

    interface MyObject {
        title: string;
        link: string;
        price: string;
        whenPosted: string;
    }


    const scraper = new ScrapListings({ headless: true }); // pass headless:true in production
    let newDataAll: Listing[] = [];
    for (const url of MUDAH_URL) {
        const newData = await scraper.findNewListings(url);
        newDataAll = [...newDataAll, ...newData];
    }
    await scraper.close();

    const newCount = insertNewListings(newDataAll);

    if (newCount > 0) {
        const latest = getNewListings();
        console.log(latest);
        await telegram.notifyNewListings(latest, newCount);
    } else {
        console.log("❌ No new listings found.");
    }


    db.close();

})();
