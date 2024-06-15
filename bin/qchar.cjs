/* eslint-disable no-undef */
const puppeteer = require('puppeteer')
const fs = require('fs-extra')
const path = require('path')

const shipList = fs.readJSONSync(path.join(__dirname, '../src/assets/data/ship.json'))

const fail = []

puppeteer
  .launch({
    headless: 'new',
    args: ['--no-sandbox']
  })
  .then(async (browser) => start(browser))

const getQchar = async (page) => {
  for (const i in shipList) {
    if (shipList[i].qchar) continue

    const name = shipList[i].key
    let flag = false
    if (name.endsWith('.改')) {
      flag = true
    }
    let qchar
    try {
      await page.goto(
        `https://wiki.biligame.com/blhx/文件:${flag ? name.replace('.改', '') : name}Q版${flag ? '改造' : '立绘'}.png`
      )
      qchar = await page.$eval('#file', (el) => el.children[0].href)
    } catch {
      if (shipList[i].name) {
        await page.goto(
          `https://wiki.biligame.com/blhx/文件:${flag ? shipList[i].name.replace('.改', '') : shipList[i].name}Q版${flag ? '改造' : '立绘'}.png`
        )
        qchar = await page.$eval('#file', (el) => el.children[0].href)
      }
    }

    if (qchar) {
      shipList[i].qchar = qchar
      console.log(new Date().toLocaleString(), `${name}Q版立绘已获取 [${i}/${shipList.length}]`)
      fs.writeJsonSync(path.join(__dirname, '../src/assets/data/ship.json'), shipList, {
        spaces: 2
      })
    } else {
      fail.push(name)
      console.log(new Date().toLocaleString(), `${name}Q版立绘获取失败 [${i}/${shipList.length}]`)
    }
  }
}

const start = async (browser) => {
  const page = await browser.newPage()

  await getQchar(page)

  console.log(
    new Date().toLocaleString(),
    `舰船Q版立绘已更新 - [${shipList.length - fail.length}/${shipList.length}]`
  )
  if (fail.length > 0) {
    console.log(new Date().toLocaleString(), `失败: ${fail}`)
  }

  browser.close()
}
