
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const DELAY = 2000; // ms
const SCROLL_DELAY = 1000;

async function scrapeYokAtlas(scoreType: 'SAY' | 'EA' = 'SAY', limit: number = 500) {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });


    const page = await browser.newPage();

    // Enable console logging from browser
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    // YÖK Atlas URL (Bachelor's degree - Lisans)
    // p=say for Numerical, p=ea for Equal Weight
    const url = `https://yokatlas.yok.gov.tr/tercih-sihirbazi-t4-tablo.php?p=${scoreType.toLowerCase()}`;

    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for the table to load
    try {
        await page.waitForSelector('#mydata tbody tr', { timeout: 30000 });
    } catch (e) {
        console.error("Timeout waiting for data table. Access might be blocked or slow.");
        await browser.close();
        return;
    }

    // Select 100 entries per page to minimize clicks
    try {
        await page.select('select[name="mydata_length"]', '100');
        console.log("Selected '100' entries.");
        await new Promise(r => setTimeout(r, 3000));
    } catch (e) {
        console.log("Could not select '100' entries.");
    }

    let allItems: any[] = [];
    let pageNum = 1;

    // Pagination loop
    while (allItems.length < limit) {
        console.log(`Processing page ${pageNum}...`);

        // Extract Data from current page
        const pageData = await page.evaluate((currentScoreType) => {
            const rows = Array.from(document.querySelectorAll('#mydata tbody tr'));

            return rows.map((tr) => {
                const cells = Array.from(tr.querySelectorAll('td'));

                if (cells.length < 5) return null;

                const cell2Html = cells[2].innerHTML;
                let code = null;
                const codeMatch = cell2Html.match(/(?:addToMyList|ekle|program_kodu|yop_kodu)[^0-9]*(\d{9})/i);
                if (codeMatch) {
                    code = codeMatch[1];
                } else {
                    const hrefMatch = cell2Html.match(/href="[^"]*y=(\d{9})/);
                    if (hrefMatch) code = hrefMatch[1];
                }

                const cell1Text = cells[1].innerText.trim();
                const parts1 = cell1Text.split('\n');
                const university = parts1[0]?.trim();
                const faculty = parts1[1]?.trim();

                const cell2Text = cells[2].innerText.trim();
                const parts2 = cell2Text.split('\n');
                const program = parts2[0]?.trim();
                const details = parts2.slice(1).join(' ');

                const cell3Text = cells[3].innerText.trim();
                const rank = cell3Text.split(/\s+/)[0];

                const cell4Text = cells[4].innerText.trim();
                const score = cell4Text.split(/\s+/)[0];

                return {
                    code,
                    university,
                    faculty,
                    program,
                    score_type: currentScoreType,
                    quota: '0',
                    score: score,
                    rank: rank,
                    detail: details
                };
            }).filter(item => item !== null && item.code);
        }, scoreType); // Pass scoreType to the page.evaluate context

        console.log(`Extracted ${pageData.length} items from page ${pageNum}.`);
        allItems = [...allItems, ...pageData];

        if (allItems.length >= limit) break;

        // Check for Next button
        // DataTables usually has class 'paginate_button next' and id ending in '_next'
        const isNextDisabled = await page.evaluate(() => {
            const nextBtn = document.querySelector('.paginate_button.next');
            return !nextBtn || nextBtn.classList.contains('disabled');
        });

        if (isNextDisabled) {
            console.log("Next button disabled or not found. Finished.");
            break;
        }

        // Click Next
        try {
            await page.click('.paginate_button.next');
            await new Promise(r => setTimeout(r, 2000)); // Wait for load
            pageNum++;
        } catch (e) {
            console.log("Error clicking next:", e);
            break;
        }
    }

    const data = allItems; // Reassign for subsequent code


    console.log(`Extracted ${data.length} items.`);

    // Post-process to clean data (e.g. remove '---')
    const cleanedData = data.map((item: any) => ({
        ...item,
        score: item.score === '---' || item.score === 'Dolmadı' ? '0' : item.score,
        rank: item.rank === '---' || item.rank === 'Dolmadı' ? '9999999' : item.rank,
    }));

    // Save to JSON
    const outputPath = path.join(process.cwd(), `src/data/universities_${scoreType.toLowerCase()}_batch_new.json`);
    fs.writeFileSync(outputPath, JSON.stringify(cleanedData, null, 2));

    console.log(`Saved data to ${outputPath}`);

    await browser.close();
}

// Check command line args
const args = process.argv.slice(2);
const typeArg = args.find(a => a === 'SAY' || a === 'EA') as 'SAY' | 'EA' | undefined;
const limitArg = args.find(a => !isNaN(parseInt(a))) ? parseInt(args.find(a => !isNaN(parseInt(a)))!) : 500;

scrapeYokAtlas(typeArg || 'EA', limitArg);
