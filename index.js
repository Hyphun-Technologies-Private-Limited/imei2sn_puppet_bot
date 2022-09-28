//const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const puppeteerAfp = require('puppeteer-afp');
const userAgent = require('user-agents');
//const iPhone = puppeteer.devices['iPhone X'];
const fs = require('fs');
profileDir = 'profiles';
puppeteer.launch({
    headless: false,
    //isMobile: true,
    //devtools: true,
    args: [
        '--disable-web-security',
        '--no-sandbox',
        '--proxy-server=zproxy.lum-superproxy.io:22225'
    ],
    //executablePath: "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    //executablePath: "brave-browser",
    userDataDir: profileDir
}).then(async browser => {
    try {
        //console.log('Running tests..')
        var [page] = await browser.pages();
        await page.authenticate({
            username: 'lum-customer-c_fe062336-zone-zone2',
            password: 'o1es48eb18wp'
        });
        
        await page.setRequestInterception(true);
        await page.setUserAgent(userAgent.toString());
        page.on('request', (req) => {
            // if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image') {
            if (req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font') {
                req.abort();
            }
            else if (req.url().endsWith('co-browsing.js')) {
                req.abort();
            }
            // else if (req.url().startsWith('https://www.google-analytics.com/j/collect')) {
            //     req.abort();
            // }
            // else if (req.url().startsWith('https://static.klaviyo.com/')) {
            //     req.abort();
            // }
            // else if (req.url().endsWith('javascripts/tracking-vanilla.min.js')) {
            //     req.abort();
            // }
            else if (req.url().endsWith('psmedpuntivendita/ajaxAssistenza')) {
                let payload = req.postData();
                console.log(payload);
                if (payload.indexOf('ControllaTokenGoogle') > 0) { 
                    //req.abort();
                    req.continue();
                } else {
                    req.continue();
                }
               
                //req.abort();
            }else {
                req.continue();
            }
        });
        page.on('response', async (response) => {
            if (response.url().endsWith('psmedpuntivendita/ajaxAssistenza')) {
                const responseText = await response.text();
                console.log(responseText.indexOf('GSX'));
                if(responseText.indexOf('GSX') > 0){
                    console.log(responseText);
                    await page.close();
                    await browser.close();
                }
                //console.log(responseText);
            }

            if(response.url().endsWith('api2/reload?k=6LdVOgQiAAAAAPG1K4Aq7zpwja8-wAs0lf2him47')) {
                const responseText = await response.text();
                console.log(responseText);
                await page.close();
                await browser.close();
            }
        });

        await page.goto('https://www.medstore.it/richiesta-assistenza')
        //await page.$eval('div.footer-container', el => el.remove());
        //await page.waitForSelector('span.cookiesplus-accept-label');
        //await page.click("span.cookiesplus-accept-label");
        await page.waitForSelector('h4.testoDispositivo');
        await page.click("h4.testoDispositivo");
        await page.waitForNavigation();
        await page.waitForSelector('input#codiceSerialeControlloIniziale');
        await page.$eval('input[name=codiceSerialeControlloIniziale]', el => el.value = '352847110338660');
        await page.select('#iddispositivo', '165')
        await page.waitForTimeout(1000);
        page.click('button.btnControllaSeriale'); 
        await page.waitForNavigation();
        
        //await page.close();
        //await browser.close()
    } catch (e) {
        if (fs.existsSync(profileDir)) {
            fs.rm(profileDir, { recursive: true, force: true }, (error) => {
                //you can handle the error here
            })
        }
        console.log(e);
        //await page.close();
        //await browser.close();
    }
})
//}

//module.exports.fetchPosts = fetchPosts