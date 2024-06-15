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
  await page.goto('https://wiki.biligame.com/blhx/%E8%88%B0%E8%88%B9%E5%9B%BE%E9%89%B4')
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

const loadText = (text) => {
  const list = {}
  let group = ''
  let type = ''

  text.split('\n').forEach((item) => {
    if (item.startsWith('===')) {
      type = item.replaceAll('=', '').replace('\r', '')
      return
    }
    if (item.startsWith('==')) {
      group = item.replaceAll('=', '').replace('阵营', '').replace('\r', '')
      return
    }
    if (item.includes('@')) {
      const temp = item
        .replace(/\{|\}|小图标\||<br>/g, '')
        .replace('\r', '')
        .split('@')
      const key = temp[0].split('|')[0]
      list[key] = {
        nickname: temp[1],
        type,
        group
      }
    }
  })

  return list
}

const ID = {
  白鹰: 1,
  皇家: 9,
  重樱: 16,
  铁血: 23,
  东煌: 30,
  北方联合: 31,
  '自由鸢尾&维希教廷': 32,
  撒丁帝国: 33
}

const getNickname = async (page, id) => {
  await page.goto(
    `https://wiki.biligame.com/blhx/index.php?title=JUUs动态舰船昵称分析&action=edit&section=${id}`
  )

  return loadText(await page.$eval('textarea', (el) => el.value))
}

const getShip = async (page) => {
  let temp = {}

  for (const key in ID) {
    console.log(new Date().toLocaleString(), `获取${key}昵称`)
    temp = await getNickname(page, ID[key])
    for (const i in shipList) {
      if (shipList[i].nickname) continue
      shipList[i].nickname = temp?.[shipList[i].key]?.nickname || temp?.[shipList[i].alias]?.nickname || ''
    }
    console.log(new Date().toLocaleString(), `${key}昵称已获取 - [${Object.keys(temp).length}]`)
  }
}

const start = async (browser) => {
  const page = await browser.newPage()

  await getShipInfo(page)
  await getShip(page)

  fs.writeJsonSync(path.join(__dirname, '../src/assets/data/ship.json'), shipList, { spaces: 2 })
  console.log(new Date().toLocaleString(), `舰船数据已保存 - [${shipList.length}]`)

  browser.close()
}
