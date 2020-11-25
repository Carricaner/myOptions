const http = require('http');
const https = require('https');
const cheerio = require('cheerio');
const request = require('request');
const puppeteer = require('puppeteer');
const fs = require('fs');


//Task: 包成async  ==> 原本就是Async?? ==> 確定不是promise based
// https.get('https://www.taifex.com.tw/cht/3/totalTableDate', (res) => {
//     console.log('Status Code: ' + res.statusCode);
//     res.on('data', (chunk) => {

//         // console.log('Body: ' + chunk)
//         const $ = cheerio.load(chunk);
//         let snippet = $('tr td div').text();
//         console.log(snippet) 
//     })
// })
// .on('error', (e) => {
//     console.log("Got error: " + e.message)
// })


// request({
//     url : 'https://mis.taifex.com.tw/futures/AfterHoursSession/EquityIndices/Options/',
//     method: 'GET'
// }, function(err, response, body) {
//     if (err || !body) {
//         console.log("Somthing's wrong...")
//     }
//     console.log(body)
// })

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://example.com');
//     // await page.screenshot({path: 'example.png'});
   
//     await browser.close();
//   })();

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://news.ycombinator.com', {waitUntil: 'networkidle2'});
//   await page.pdf({path: 'hn.pdf', format: 'A4'});
 
//   await browser.close();
// })();

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://example.com');
 
//   // Get the "viewport" of the page, as reported by the page.
//   const dimensions = await page.evaluate(() => {
//     return {
//       width: document.documentElement.clientWidth,
//       height: document.documentElement.clientHeight,
//       deviceScaleFactor: window.devicePixelRatio
//     };
//   });
 
//   console.log('Dimensions:', dimensions);
 
//   await browser.close();
// })();


const testPup = async () => {
  const browser = await puppeteer.launch({
    headless: true, // default is true => cancel headless mode
    slowMo: 150 // slow down by 250ms
  }); 
  const page = await browser.newPage();
  // 夜盤
  // await page.goto('https://mis.taifex.com.tw/futures/AfterHoursSession/EquityIndices/Options/');
  // 日盤
  await page.goto('https://mis.taifex.com.tw/futures/RegularSession/EquityIndices/Options/');
  
  // 點擊按鈕
  const buttonSelector = `#content > main > div.container > div.approve-wrap > button:nth-child(2)`;
  await page.waitForSelector(buttonSelector); // 確定網頁的元素出現
  await page.click(buttonSelector);

  // Derive successfully!!
  const sth = `#content > main > div.container > div.row.no-gutters.pb-2 > div.col-12.order-sm-last.mb-5 > div > div > table.table.quotes-table.mb-1.options-t.sticky-table-horizontal.sticky-table-horizontal-2 > tbody > tr:nth-child(42) > td.cr.strike_price > div`;
  const content = await page.$eval(sth, el => el.textContent)
  console.log(content)

  // page.$(sth).then(result => console.log(result))
  // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  // await page.evaluate(() => console.log(`url is ${location.href}`));

  // halt a second  等待一秒
  await page.waitForTimeout(1000);

  // Derive whole HTML successfully!!
  let bodyHTML = await page.evaluate(() => document.body.innerHTML);
  // console.log(bodyHTML)
  console.log(typeof bodyHTML)
  fs.writeFile('test.html', bodyHTML, function(err) {
    if (err) 
    { 
      console.log(err)
    } else {
      console.log('Writing OK!')
    }
  })
  
  // console.log(await page.evaluate('1 + 2')); // 输出 "3"
  // const x = 10;
  // console.log(await page.evaluate(`1 + ${x}`)); // 输出 "11"
  // const result = await page.evaluate(x => {
  //   return Promise.resolve(8 * x);
  // }, 7); // （译者注： 7 可以是你自己代码里任意方式得到的值）
  // console.log(result); // 输出 "56"

  await browser.close();
}
testPup()




const sampleSnippet = `<ul id="fruits">
<li class="apple">456Apple</li>
<li class="orange">Orange123</li>
<li class="pear">Pear</li>
</ul>`

const $ = cheerio.load(sampleSnippet);
// = $('ul', '<ul id="fruits">...</ul>');


console.log($('.apple', '#fruits').text())
console.log($('ul .pear').attr('class'))
console.log($('li[class=orange]').html())









