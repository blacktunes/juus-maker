module.exports = content => {
  return `export const txt = ${JSON.stringify(content)}`
}
