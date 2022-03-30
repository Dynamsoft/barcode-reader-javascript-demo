import {BarcodeReader} from "dynamsoft-javascript-barcode";
BarcodeReader.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.0.0/dist/";
// Please visit https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&package=js&utm_source=github to get a trial license
let finishLoadingWasnTime;
let startLoadingPageTime = window.startLoadingPageTime;
let sessionData = {};
BarcodeReader.loadWasm().then(() => {
    finishLoadingWasnTime = Date.now();
    let waitLoadingTime = finishLoadingWasnTime - startLoadingPageTime;
    sessionData = {
        sessionId: window.sessionId,
        waitLoadingTime: waitLoadingTime
    };
    postSessionData(sessionData, false);
}).catch((err) => {
    sessionData = {
        sessionId: window.sessionId,
        failLoadWasm: 1,
        failLoadWasmMessage: err.message
    };
    postSessionData(sessionData, false);
});