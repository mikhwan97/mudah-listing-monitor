import Database from "better-sqlite3";

export type Listing ={
    title: string;
    link: string;
    price:string;
    when_posted: string;
    date_found?: string;
};

export default class ListingDB {
    private db: Database.Database;
    private insertStmt: Database.Statement;
    private getLatestStmt: Database.Statement;

    constructor(dbFilePath: string) {
        this.db = new Database(dbFilePath);
        this.ensureSchema();
        this.insertStmt = this.db.prepare("INSERT OR IGNORE INTO listings (title, link, price, when_posted) VALUES (?, ?, ?, ?) ");
        this.getLatestStmt = this.db.prepare("SELECT title, link, price, when_posted, date_found FROM listings ORDER BY date_found DESC LIMIT (?)");
    }
    
    private ensureSchema() {
        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS listings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                link TEXT UNIQUE,
                price TEXT,
                when_posted TEXT,
                date_found DATETIME DEFAULT CURRENT_TIMESTAMP
        )`).run();
    }

    insertMany(listings: Listing[]): number {
        if(!listings.length) return 0;
        const insertManyTxn = this.db.transaction((rows: Listing[]) => {
            let added=0;
            for (const r of rows) {
                const info = this.insertStmt.run(r.title, r.link, r.price, r.when_posted);
                if (info.changes > 0) added++ ;
            }
            return added;
        });
        return insertManyTxn(listings);
    }

    getLatest(limit=10): Listing[] {
        return this.getLatestStmt.all(limit) as Listing[];
    }

    close() {
        try {this.db.close();} catch(e) { console.error("Error closing DB:", e);}
    }


}