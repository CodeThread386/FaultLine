const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  const html = await page.content();
  if (html.includes('GLOBAL CRITICAL REACT ERROR') || html.includes('CRITICAL REACT ERROR') || html.includes('missing required error components')) {
    console.log('FOUND ERROR UI! HTML SNIPPET:', html.substring(0, 500));
  }
  await browser.close();
})();
