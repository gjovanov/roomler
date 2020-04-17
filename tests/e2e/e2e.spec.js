const path = require('path')
const test = require('ava')
const puppeteer = require('puppeteer')
const consola = require('consola')

// const pti = require('puppeteer-to-istanbul')
const saveCoverage = require('puppeteer-coverage').saveCoverage
const nycOutputPath = path.resolve('../../.nyc_output/')

const host = 'localhost'
const port = 4000
const url = `http://${host}:${port}`
let browser = null
let page = null
let jsCoverage = null

test.before('Start pupeteer', async (t) => {
  consola.info('starting pupeteer')
  browser = await puppeteer.launch({
    headless: false
    // slowMo: 250
  })
  page = await browser.newPage()
  await Promise.all([
    page.coverage.startJSCoverage()
  ])
})

test('Route / exits and render HTML', async (t) => {
  await page.goto(url, {
    waitUntil: 'load'
  })
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Roomler.Live")'
  )
  const element = await page.$('title')
  const text = await page.evaluate(element => element.textContent, element)
  consola.info(`|${text}|`)
  t.true(text === 'roomer.live - roomer.live')

  const jsCoverage = await page.coverage.stopJSCoverage()
  saveCoverage(jsCoverage, nycOutputPath)
  await page.screenshot({
    path: 'example.png'
  })

  t.pass()
})

test.before('Close pupeteer', async (t) => {
  if (browser) {
    jsCoverage = await page.coverage.stopJSCoverage()
    saveCoverage(jsCoverage, nycOutputPath)
    // pti.write([...jsCoverage])
    consola.success('closing pupeteer')
    await browser.close()
  }
})
