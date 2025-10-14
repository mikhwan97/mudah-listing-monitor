import { Listing } from "../db/db";

export default class TelegramNotifier {
    constructor(
        private botToken: string,
        private chatId: string
    ) {}

    async sendMessage(message: string) {
        const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: this.chatId,
                text: message,
                parse_mode: "HTML",
            }),
        });
    }

    async notifyNewListings(listings: Listing[], count: number) {
        const msg = listings
            .slice(0, count)
            .map(item => `<b>${item.title}</b>\n${item.when_posted}\n${item.price}\n${item.link}`)
            .join("\n\n");
        
        const fullMsg = `🤖✅ <b>${count} new listings found!</b>\n\n${msg}`;
        await this.sendMessage(fullMsg);
    }
}