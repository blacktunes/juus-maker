const avatar = {}
document.getElementsByClassName('xtb-image').forEach(item => {
  avatar[item.children[0].attributes[1].nodeValue] = decodeURI(item.children[0].children[0].currentSrc).replace('30px', '85px')
})
console.table(avatar)
