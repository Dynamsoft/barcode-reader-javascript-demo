import "dynamsoft-license";
import "dynamsoft-capture-vision-router";
import "dynamsoft-barcode-reader";
import "dynamsoft-code-parser";

import { CoreModule } from "dynamsoft-core";
import { LicenseManager } from "dynamsoft-license";
import { CodeParserModule } from "dynamsoft-code-parser";

CoreModule.engineResourcePaths.rootDirectory = "https://cdn.jsdelivr.net/npm/";

/** LICENSE ALERT - README
 * To use the library, you need to first specify a license key using the API "initLicense()" as shown below.
 */

LicenseManager.initLicense("YOUR_LICENSE_KEY_HERE");

/**
 * You can visit https://www.dynamsoft.com/customer/license/trialLicense?utm_source=github&product=dbr&package=js to get your own trial license good for 30 days.
 * Note that if you downloaded this sample from Dynamsoft while logged in, the above license key may already be your own 30-day trial license.
 * For more information, see https://www.dynamsoft.com/barcode-reader/docs/web/programming/javascript/user-guide/index.html?ver=10.4.2001&utm_source=github#specify-the-license#specify-the-license or contact support@dynamsoft.com.
 * LICENSE ALERT - THE END
 */

CodeParserModule.loadSpec(["AADHAAR", "AAMVA_DL_ID_WITH_MAG_STRIPE", "AAMVA_DL_ID", "SOUTH_AFRICA_DL"]);

CoreModule.loadWasm(["DBR", "DCP"]);
