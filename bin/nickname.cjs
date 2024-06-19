/* eslint-disable no-undef */
const puppeteer = require('puppeteer')
const fs = require('fs-extra')
const path = require('path')

let shipList = fs.readJSONSync(path.join(__dirname, '../src/assets/data/ship.json'))
let pageList = []
const nameList = {}

puppeteer
  .launch({
    headless: 'new',
    args: ['--no-sandbox']
  })
  .then(async (browser) => start(browser))

const getPageList = async (page) => {
  await page.goto('https://wiki.biligame.com/blhx/JUUs动态')
  const panel = await page.$('.panel-heading')
  pageList = await panel.$$eval('.panel-title', (el) => {
    const list = []
    el.forEach((item) => {
      list.push(item.innerText.replace('（当期）', ''))
    })
    return list
  })
  console.log(new Date().toLocaleString(), `已获取JUUs动态期数 -`, pageList.length)
}

const getNickname = async (page) => {
  for (const panel of pageList) {
    console.log(new Date().toLocaleString(), panel, '昵称已获取')
    await page.goto(`https://wiki.biligame.com/blhx/JUUs动态/${panel}`)
    const postList = await page.$$('.JUUSposting')
    for (const el of postList) {
      const name = await el.$eval('a', (e) => e.title)
      const nickname = await el.$eval('.JUUSpostingUser', (e) => e.innerText)
      if (!(name in nameList) && nickname) {
        nameList[name] = nickname
      }
    }

    const commentList = await page.$$eval('.JUUScomment', async (el) => {
      const list = {}
      el.forEach((item) => {
        const name = item.children[0].children[0].title
        const nickname = item.children[1]?.innerText
        if (!(name in list) && nickname) {
          list[name] = nickname
        }
      })
      return list
    })

    for (const name in commentList) {
      if (!(name in nameList) && commentList[name]) {
        nameList[name] = commentList[name]
      }
    }
  }
}

const updateNickname = () => {
  for (const i in shipList) {
    if (shipList[i].key in nameList) {
      shipList[i].nickname = nameList[shipList[i].key]
    }
  }
}

const start = async (browser) => {
  const page = await browser.newPage()

  await getPageList(page)
  await getNickname(page)
  updateNickname()

  fs.writeJsonSync(path.join(__dirname, '../src/assets/data/ship.json'), shipList, { spaces: 2 })
  console.log(new Date().toLocaleString(), `舰船昵称已更新 - [${Object.keys(nameList).length}]`)

  browser.close()
}
