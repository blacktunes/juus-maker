/* eslint-disable no-undef */
const puppeteer = require('puppeteer')
const fs = require('fs-extra')
const path = require('path')

let shipList = []

puppeteer
  .launch({
    headless: 'new',
    args: ['--no-sandbox']
  })
  .then(async (browser) => start(browser))

const getShipInfo = async (page) => {
  console.log(new Date().toLocaleString(), '获取图鉴列表')
  await page.goto('https://wiki.biligame.com/blhx/舰船图鉴')
  shipList = await page.$$eval('.jntj-1', (el) => {
    const _shipList = []
    el.forEach((item) => {
      const name = item.children[1].children[0].innerText.split('\n')
      const srcset = item.children[0].children[0].srcset.split(',')

      let image = item.children[0].children[0].src
      for (const source of srcset) {
        const _source = source.trim()
        if (_source.endsWith('2x')) {
          image = _source.split(' ')[0]
          break
        }
      }

      _shipList.push({
        key: name[0],
        name: name[0],
        alias: name[1] || '',
        nickname: '',
        avatar: image,
        data: JSON.parse(JSON.stringify(item.dataset))
      })
    })
    console.log(new Date().toLocaleString(), '图鉴列表已获取')
    return _shipList
  })
}

const start = async (browser) => {
  const page = await browser.newPage()

  await getShipInfo(page)

  fs.writeJsonSync(path.join(__dirname, '../src/assets/data/ship.json'), shipList, { spaces: 2 })
  console.log(new Date().toLocaleString(), `舰船数据已保存 - [${shipList.length}]`)

  browser.close()
}
