import fs from 'fs';
import path from 'path';

interface UrlConfig {
    searchUrls: string[];
}

export function loadUrlConfig(): UrlConfig {
    const configPath = path.join(__dirname, '../../../data/searchUrls.json');
    const rawConfig = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(rawConfig) as UrlConfig;
}