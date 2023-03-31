const puppeteer = require('puppeteer')
const fs = require('fs-extra')
const path = require('path')

puppeteer.launch({
  headless: true,
  args: ['--no-sandbox']
})
  .then(async browser => start(browser))

const getAvatar = async page => {
  console.log(new Date().toLocaleString(), '开始请求头像数据')

  await page.goto('https://wiki.biligame.com/blhx/JUUs动态舰船昵称分析')
  console.log(new Date().toLocaleString(), '头像数据已获取')

  const avatarUrlList = await page.$$eval('.xtb-image', el => {
    const avatar = {}
    el.forEach(item => {
      console.log(item)
      avatar[item.children[0].attributes[1].nodeValue] = decodeURI(item.children[0].children[0].currentSrc).replace('30px', '85px')
    })
    return avatar
  })

  fs.writeJsonSync(path.join(__dirname, '../src/assets/data/avatar.json'), avatarUrlList, { spaces: 2 })
  console.log(new Date().toLocaleString(), `头像数据已保存 - [${Object.keys(avatarUrlList).length}]`)
}

const loadTxt = text => {
  const list = {}
  let group = ''
  let type = ''

  text.split('\n').forEach(item => {
    if (item.startsWith('===')) {
      type = item.replaceAll('=', '').replace('\r', '')
      return
    }
    if (item.startsWith('==')) {
      group = item.replaceAll('=', '').replace('阵营', '').replace('\r', '')
      return
    }
    if (item.includes('@')) {
      const temp = item.replace(/\{|\}|小图标\||<br>/g, '').replace('\r', '').split('@')
      const key = temp[0].split('|')[0]
      list[key] = {
        avatar: '',
        name: temp[1],
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

const getShipData = async (page, id) => {
  await page.goto(`https://wiki.biligame.com/blhx/index.php?title=JUUs动态舰船昵称分析&action=edit&section=${id}`)

  return loadTxt(await page.$eval('textarea', el => el.value))
}

const getShip = async page => {
  let ship = {}

  for (const key in ID) {
    console.log(new Date().toLocaleString(), `开始请求${key}数据`)
    const temp = await getShipData(page, ID[key])
    ship = { ...ship, ...temp }
    console.log(new Date().toLocaleString(), `${key}数据已获取 - [${Object.keys(temp).length}]`)
  }

  fs.writeJsonSync(path.join(__dirname, '../src/assets/data/ship.json'), ship, { spaces: 2 })
  console.log(new Date().toLocaleString(), `舰船数据已保存 - [${Object.keys(ship).length}]`)
}

const start = async browser => {
  const page = await browser.newPage()

  await getAvatar(page)
  await getShip(page)

  browser.close()
}
