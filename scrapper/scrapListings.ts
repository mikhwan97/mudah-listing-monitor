import { chromium, Browser } from "playwright";
import { Listing } from "../db/db";

export default class ScrapListings {
    private browser?: Browser | undefined;
    private lastRequestTime: number = 0;
    private readonly minDelayBetweenRequests = 5000; // 5 seconds minimum delay
    
    constructor(private opts: { 
        headless?: boolean,
        maxRetries?: number,
        requestDelay?: number // delay in ms between requests
    } = { 
        headless: true,
        maxRetries: 3,
        requestDelay: 5000
    }) { }

    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async waitForNextRequest(): Promise<void> {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        const delayNeeded = Math.max(0, this.minDelayBetweenRequests - timeSinceLastRequest);
        
        if (delayNeeded > 0) {
            await this.delay(delayNeeded);
        }
        
        this.lastRequestTime = Date.now();
    }

    async init(): Promise<Browser> {
        if (!this.browser) {
            const headless: boolean = this.opts.headless ?? true;
            this.browser = await chromium.launch({ 
                headless,
                args: [
                    '--disable-dev-shm-usage',
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            });
        }
        return this.browser!;
    }

    async findNewListings(url: string): Promise<Listing[]> {
        await this.waitForNextRequest(); // Rate limiting
        const browser = await this.init();
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        const page = await context.newPage();
        
        try {
            // Add random delay between 1-3 seconds before each request
            await this.delay(1000 + Math.random() * 2000);
            
            await page.goto(url, { 
                timeout: 30000,
                waitUntil: 'domcontentloaded'
            });

            // Random delay after page load
            await this.delay(1000 + Math.random() * 1000);

            await page.waitForSelector('div[data-testid^="listing-ad-item"]', { 
                timeout: 20000
            });

            const listings = await page.$$eval(
                'div[data-testid^="listing-ad-item"]',
                (items) => {
                    return Array.from(items).map((item) => {
                        const linkEl = item.querySelector('a[href*="mudah.my"]');
                        const title = linkEl?.getAttribute("title") ||
                            linkEl?.querySelector("h2")?.textContent?.trim() ||
                            "";
                        const link = (linkEl as HTMLAnchorElement)?.href || "";

                        const priceEl = Array.from(item.querySelectorAll("div.font-bold"))
                            .find((el) => el.textContent?.includes("RM"));
                        const price = (priceEl?.textContent || "").replace(/\s+/g, " ").trim();

                        const timeRegex = /(Yesterday|Today|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[^<]{0,15}\d{1,2}:\d{2}/i;
                        let when_posted = "";
                        const possibleDivs = Array.from(item.querySelectorAll("div"));
                        for (const div of possibleDivs) {
                            const match = div.textContent?.match(timeRegex);
                            if (match) {
                                when_posted = match[0].trim();
                                break;
                            }
                        }

                        return { title, link, price, when_posted };
                    });
                }
            );

            return listings;
        } catch (error) {
            console.error(`Failed to fetch listings: ${error}`);
            return [];
        } finally {
            await context.close();
        }
    }

    async close() {
        await this.browser?.close();
        this.browser = undefined;
    }
}