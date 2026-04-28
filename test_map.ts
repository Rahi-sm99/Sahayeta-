import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173');
  
  // Wait for React to mount
  await new Promise(r => setTimeout(r, 2000));
  
  // Click SIMULATION
  await page.evaluate(() => {
    const links = document.querySelectorAll('.nav-link');
    for (const link of links) {
      if (link.textContent?.includes('SIMULATION')) {
        (link as HTMLElement).click();
      }
    }
  });
  
  // Wait for map
  await new Promise(r => setTimeout(r, 3000));
  
  const markers = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.custom-marker')).map(el => {
      return {
        style: (el as HTMLElement).style.cssText,
        transform: (el as HTMLElement).style.transform,
        pos: (el as HTMLElement).getBoundingClientRect(),
        html: el.outerHTML
      };
    });
  });
  
  console.log(JSON.stringify(markers, null, 2));
  await browser.close();
})();
