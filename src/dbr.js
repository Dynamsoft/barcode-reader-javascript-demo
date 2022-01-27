import DBR from "dynamsoft-javascript-barcode";
DBR.BarcodeReader.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@8.8.7/dist/";
// Please visit https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&package=js&utm_source=github to get a trial license
DBR.BarcodeReader.organizationID = "Your-Organization-ID";
DBR.BarcodeReader.loadWasm();
export default DBR;