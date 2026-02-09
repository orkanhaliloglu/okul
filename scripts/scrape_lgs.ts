
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Base URL for the LGS source
const BASE_URL = 'https://www.basarisiralamalari.com/';

// List of major cities
const CITIES = [
    'istanbul', 'ankara', 'izmir', 'bursa', 'antalya', 'adana',
    'konya', 'gaziantep', 'sanliurfa', 'kocaeli', 'mersin'
];

async function scrapeLgsData() {
    // Check existing data to resume
    const outputPath = path.join(process.cwd(), 'src/data/high_schools_lgs.json');
    let existingData: any[] = [];
    if (fs.existsSync(outputPath)) {
        existingData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
        console.log(`Loaded ${existingData.length} existing records.`);
    }

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    for (const city of CITIES) {
        // Skip if city already has substantial data (>50 records)
        // Handle Turkish I/i problem
        const cityCount = existingData.filter((s: any) =>
            s.city.toLocaleLowerCase('tr-TR') === city.toLocaleLowerCase('tr-TR') ||
            s.city.toLowerCase() === city.toLowerCase()
        ).length;

        if (cityCount > 50) {
            console.log(`Skipping ${city.toUpperCase()} (Found ${cityCount} records).`);
            continue;
        }

        // URL pattern differs for some cities
        let url = `${BASE_URL}${city}-lise-taban-puanlari-2024-yuzdelik-dilimleri-lgs-meb/`;
        if (city !== 'istanbul') {
            url = `${BASE_URL}${city}-lise-taban-puanlari-2024-ve-yuzdelik-dilimleri-lgs-meb/`;
        }

        console.log(`Navigating to ${city.toUpperCase()} (${url})...`);

        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
            // Wait for dynamic content
            await new Promise(r => setTimeout(r, 5000));
        } catch (e) {
            console.error(`Failed to load ${city}:`, e);
            continue;
        }

        // Aggressive Scroll
        console.log("Scrolling...");
        await page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 50;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight || totalHeight > 30000) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 50);
            });
        });
        // Extra wait after scroll
        await new Promise(r => setTimeout(r, 3000));


        // Extract Data
        const cityData = await page.evaluate((cityName) => {
            const allRows = Array.from(document.querySelectorAll('table tbody tr'));
            const rows = allRows.slice(0, 500); // Limit 500

            console.log(`Found ${allRows.length} rows total. processing first ${rows.length}.`);

            const data: any[] = [];

            rows.forEach((tr, index) => {
                if (index === 0) return; // Skip header

                const cells = Array.from(tr.querySelectorAll('td'));
                if (cells.length < 9) return;

                // Handle multi-line cells
                const yearText = cells[5]?.innerText?.trim();
                const year = yearText ? yearText.split('\n')[0].trim() : '';
                if (year !== '2024') return;

                const col1Text = cells[0]?.innerText?.split('\n')[0].trim();
                const parts = col1Text.split('/').map(s => s.trim());

                let city = cityName;
                let district = '';
                let name = col1Text;

                if (parts.length >= 3) {
                    city = parts[0];
                    district = parts[1];
                    name = parts.slice(2).join(' / ');
                } else if (parts.length === 2) {
                    district = parts[0];
                    name = parts[1];
                }

                let type = 'Diğer';
                if (name.includes('Fen Lisesi')) type = 'Fen Lisesi';
                else if (name.includes('Anadolu Lisesi') && !name.includes('Mesleki') && !name.includes('İmam')) type = 'Anadolu Lisesi';
                else if (name.includes('İmam Hatip')) type = 'Anadolu İmam Hatip Lisesi';
                else if (name.includes('Mesleki') || name.includes('MTAL')) type = 'Mesleki ve Teknik Anadolu Lisesi';
                else if (name.includes('Sosyal Bilimler')) type = 'Sosyal Bilimler Lisesi';

                const durationText = cells[2]?.innerText?.trim().split('\n')[0];
                const duration = durationText ? durationText.replace(/\D/g, '') : '4';

                const language = cells[4]?.innerText?.trim().split('\n')[0];

                const quotaText = cells[6]?.innerText?.trim().split('\n')[0];
                const quota = quotaText ? quotaText.trim() : '0';

                const percentileText = cells[7]?.innerText?.trim().split('\n')[0];
                const percentile = percentileText ? percentileText.replace(',', '.').trim() : '0';

                const scoreText = cells[8]?.innerText?.trim().split('\n')[0];
                const score = scoreText ? scoreText.replace(',', '.').trim() : '0';

                const slug = `${city}-${district}-${name}`
                    .toLowerCase()
                    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
                    .replace(/[^a-z0-9]/g, '-')
                    .replace(/-+/g, '-').replace(/^-|-$/g, '');

                data.push({
                    name,
                    slug,
                    city,
                    district,
                    type,
                    education_duration: parseInt(duration) || 4,
                    language,
                    quota: parseInt(quota) || 0,
                    percentile: parseFloat(percentile) || 0,
                    score: parseFloat(score) || 0,
                    admission_type: 'LGS'
                });
            });

            return data;
        }, city);

        console.log(`Extracted ${cityData.length} schools for ${city}.`);

        // Load latest
        if (fs.existsSync(outputPath)) {
            existingData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
        }
        const otherCities = existingData.filter((s: any) => s.city !== city);
        const newData = [...otherCities, ...cityData];

        fs.writeFileSync(outputPath, JSON.stringify(newData, null, 2));
        console.log(`Saved. Total records: ${newData.length}`);
    }

    await browser.close();
}

scrapeLgsData();
