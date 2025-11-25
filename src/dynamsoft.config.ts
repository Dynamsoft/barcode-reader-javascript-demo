import { CoreModule, LicenseManager, CodeParserModule, CaptureVisionRouter } from "dynamsoft-barcode-reader-bundle";

CoreModule.engineResourcePaths.rootDirectory = "https://cdn.jsdelivr.net/npm/";
/** LICENSE ALERT - README
 * To use the library, you need to first specify a license key using the API "initLicense()" as shown below.
 */

const pInitLicense = LicenseManager.initLicense("YOUR-LICENSE");
/**
 * You can visit https://www.dynamsoft.com/customer/license/trialLicense?utm_source=github&product=dbr&package=js to get your own trial license good for 30 days.
 * Note that if you downloaded this sample from Dynamsoft while logged in, the above license key may already be your own 30-day trial license.
 * For more information, see https://www.dynamsoft.com/barcode-reader/programming/javascript/user-guide/?ver=10.4.2000&utm_source=github#specify-the-license or contact support@dynamsoft.com.
 * LICENSE ALERT - THE END
 */

CoreModule.loadWasm().then(async () => {
  if (CoreModule.loadedWasmType !== "baseline") {
    CaptureVisionRouter.appendDLModelBuffer("OneDLocalization");
    CaptureVisionRouter.appendDLModelBuffer("DataMatrixQRCodeLocalization");
    CaptureVisionRouter.appendDLModelBuffer("Code128Decoder");
    CaptureVisionRouter.appendDLModelBuffer("OneDDeblur");
    CaptureVisionRouter.appendDLModelBuffer("EAN13Decoder");
  }

  await pInitLicense;
  CodeParserModule.loadSpec(["AAMVA_DL_ID_WITH_MAG_STRIPE", "AAMVA_DL_ID", "SOUTH_AFRICA_DL", "VIN"]);
})