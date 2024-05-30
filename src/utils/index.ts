export function getRootFontSizePx() {
  return parseFloat(window.getComputedStyle(
    document.documentElement,
  ).fontSize)
}

export function remToPx(rem: number | string) {
  const remNum = parseFloat(rem + '')
  return parseFloat((remNum * getRootFontSizePx()).toFixed(1))
}

export function pxToRem(px: number | string) {
  const pxNum = parseFloat(px + '')
  return parseFloat((pxNum / getRootFontSizePx()).toFixed(1))
}