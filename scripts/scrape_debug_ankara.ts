
import puppeteer from 'puppeteer';

const URL = 'https://www.basarisiralamalari.com/ankara-lise-taban-puanlari-2024-yuzdelik-dilimleri-lgs-meb/';

async function debugAnkara() {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();
    try {
        await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Wait for dynamic content
        await new Promise(r => setTimeout(r, 5000));

        // Scroll & Wait
        await page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        // Check if table exists
        const tableExists = await page.$('table tbody tr');
        console.log(`Table found in main frame: ${!!tableExists}`);

        if (tableExists) {
            const rows = await page.$$eval('table tbody tr', trs => trs.length);
            console.log(`Rows found in main frame: ${rows}`);
        } else {
            // Check frames
            const frames = page.frames();
            console.log(`Total Frames: ${frames.length}`);
            for (const frame of frames) {
                try {
                    const frameTable = await frame.$('table tbody tr');
                    if (frameTable) {
                        console.log(`Table found in frame: ${frame.url()}`);
                        const rows = await frame.$$eval('table tbody tr', trs => trs.length);
                        console.log(`Frame Rows: ${rows}`);
                    }
                } catch (e) {
                    // Ignore frame access errors
                }
            }
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        // await browser.close(); // Keep open to inspect
    }
}

debugAnkara();
