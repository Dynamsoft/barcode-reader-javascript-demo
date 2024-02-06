import { BarcodeReader } from "dynamsoft-javascript-barcode";

BarcodeReader.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.6.33/dist/";

// Please visit https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&package=js&utm_source=github to get a trial license
BarcodeReader.license = "YOUR-LICENSE-KEY";

BarcodeReader.loadWasm();
