# Dynamsoft Barcode Reader JavaScript Edition Demo

This repository contains the source code for the demo of Dynamsoft Barcode Reader JavaScript Edition (DBRJS). You can try the demo from this link:
https://demo.dynamsoft.com/barcode-reader-js/.

> NOTE
>
> A big part of the source code is dedicated to making a better UI or creating better user experience for demoing purposes, which might be distracting if you intend to learn about the SDK and its basic usage.
>
> We recommend that you instead try the samples in the DBRJS samples repository https://github.com/Dynamsoft/barcode-reader-javascript-samples.
>
> The demo itself is based on Vue 2, you can find a simple Vue 2 sample at https://github.com/Dynamsoft/barcode-reader-javascript-samples/tree/main/1.hello-world/5.read-video-vue

If you would like to get this demo project running, you can follow the steps below:

## Try the project

1. Set up

    ```cmd
    npm install
    ```
    or
    ```cmd
    yarn install
    ```

2. Add license

    > If you don't have a license yet, you can [request a trial license](https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&package=js&utm_source=sampleReadme) via Dynamsoft customer portal.

    For full functionality, the license must be added in two places.
    
    2.1. Open "src/dbr.js" and add your license key in this line:

    ```js
    BarcodeReader.license = "YOUR-LICENSE-KEY";
    ```

    2.2. Open "src/dcp.js" and add your license key in this line:

    > Skip this step if you don't need to read driver's licenses.

    ```js
    CodeParser.license = "YOUR-LICENSE-KEY";
    ```

4. Run

    For development:

    ```cmd
    npm run serve
    ```
    or
    ```cmd
    yarn serve
    ```
    
    For production:

    ```cmd
    npm run build
    ```
    or
    ```cmd
    yarn build
    ```

## Contact Us

If you have any questions with these samples, feel free to submit an issue or [contact us](https://www.dynamsoft.com/company/contact/).
