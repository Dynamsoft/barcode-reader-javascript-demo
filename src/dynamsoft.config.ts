import { CoreModule, LicenseManager, CodeParserModule } from "dynamsoft-barcode-reader-bundle";

CoreModule.engineResourcePaths.rootDirectory = "https://cdn.jsdelivr.net/npm/";
/** LICENSE ALERT - README
 * To use the library, you need to first specify a license key using the API "initLicense()" as shown below.
 */

LicenseManager.initLicense("YOUR-LICENSE-KEY");
/**
 * You can visit https://www.dynamsoft.com/customer/license/trialLicense?utm_source=github&product=dbr&package=js to get your own trial license good for 30 days.
 * Note that if you downloaded this sample from Dynamsoft while logged in, the above license key may already be your own 30-day trial license.
 * For more information, see https://www.dynamsoft.com/barcode-reader/programming/javascript/user-guide/?ver=10.4.2000&utm_source=github#specify-the-license or contact support@dynamsoft.com.
 * LICENSE ALERT - THE END
 */

CodeParserModule.loadSpec(["AADHAAR"]);
CodeParserModule.loadSpec(["AAMVA_DL_ID_WITH_MAG_STRIPE"]);
CodeParserModule.loadSpec(["AAMVA_DL_ID"]);
CodeParserModule.loadSpec(["SOUTH_AFRICA_DL"]);

CoreModule.loadWasm();