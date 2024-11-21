var pos_data = { id: 0, functions: {} };
var pos_func = {};
var incPosNum = 0;

export function getPosData() {
  pos_data.functions = pos_func;
  pos_func = {};
  incPosNum = 0;

  return JSON.stringify(pos_data);
}

export function setPosId(setId) {
  pos_data.id = setId;
}

export function checkPrinterStatus() {
  var _a = { checkPrinterStatus: [] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function directPrintText(text) {
  var _a = { directPrintText: [text] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function directPrintHex(hexString) {
  var _a = { directPrintHex: [hexString] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function cutPaper(bFeedCut) {
  var _a = { cutPaper: [bFeedCut] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function setInternationalCharset(ics) {
  var _a = { setInternationalCharset: [ics] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function setCharacterset(charset) {
  var _a = { setCharacterset: [charset] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function printText(
  text,
  horizontal,
  vertical,
  bold,
  invert,
  underline,
  fonttype,
  alignment
) {
  var _a = {
    printText: [
      text,
      horizontal,
      vertical,
      bold,
      invert,
      underline,
      fonttype,
      alignment,
    ],
  };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function print1DBarcode(
  data,
  symbol,
  barWidth,
  height,
  hriPosition,
  alignment
) {
  var _a = {
    print1DBarcode: [data, symbol, barWidth, height, hriPosition, alignment],
  };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

function printPDF417(
  data,
  symbol,
  alignment,
  columnNumber,
  rowNumber,
  moduleWidth,
  moduleHeight,
  eccLevel
) {
  var _a = {
    printPDF417: [
      data,
      symbol,
      alignment,
      columnNumber,
      rowNumber,
      moduleWidth,
      moduleHeight,
      eccLevel,
    ],
  };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function printQRCode(data, model, alignment, moduleSize, eccLevel) {
  var _a = { printQRCode: [data, model, alignment, moduleSize, eccLevel] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function printGS1Databar(data, symbol, alignment, moduleSize) {
  var _a = { printGS1Databar: [data, symbol, alignment, moduleSize] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function printDataMatrix(data, alignment, moduleSize) {
  var _a = { printDataMatrix: [data, alignment, moduleSize] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function printCompositeBarcode(data, symbol, alignment, moduleSize) {
  var _a = { printCompositeBarcode: [data, symbol, alignment, moduleSize] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function printBitmap(imagedata, width, alignment, dither) {
  var _a = { printBitmap: [imagedata, width, alignment, dither] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function printBitmapFile(filepath, width, alignment, dither) {
  var _a = { printBitmapFile: [filepath, width, alignment, dither] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function printPDFFile(filepath, pageNumber, width, alignment, dither) {
  var _a = { printPDFFile: [filepath, pageNumber, width, alignment, dither] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function pagemodeBegin() {
  var _a = { pagemodeBegin: [] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function pagemodePrintArea(width, height) {
  var _a = { pagemodePrintArea: [width, height] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function pagemodePrintPosition(x, y) {
  var _a = { pagemodePrintPosition: [x, y] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function pagemodePrintDirection(direction) {
  var _a = { pagemodePrintDirection: [direction] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function pagemodeEnd() {
  var _a = { pagemodeEnd: [] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function openDrawer(pinNumber) {
  var _a = { openDrawer: [pinNumber] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}

export function setAlarm(count) {
  var _a = { setAlarm: [count] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}
