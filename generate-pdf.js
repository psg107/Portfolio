// node generate-pdf.js
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
    });
    const page = await browser.newPage();

    await page.goto('http://127.0.0.1:5500/', {
        waitUntil: 'networkidle0',
    });

    await page.evaluate(() => {
        if (typeof window.changeToPdfMode === 'function') {
            window.changeToPdfMode()
        }
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    const bodyHeight = await page.evaluate(() => {
        return Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
    });

    await page.pdf({
        path: 'portfolio.pdf',
        width: '210mm',
        height: `${Math.ceil(bodyHeight * 0.264583)}mm`,
        printBackground: true,
        margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    });

    await browser.close();
})();
