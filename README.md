# Dynamsoft Barcode Reader JavaScript Edition Demo

This repository contains the source code for the demo of Dynamsoft Barcode Reader JavaScript Edition (DBRJS). You can try the demo from this link:
https://demo.dynamsoft.com/barcode-reader-js/.

> NOTE
>
> A big part of the source code is dedicated to making a better UI or creating better user experience for demoing purposes, which might be distracting if you intend to learn about the SDK and its basic usage.
>
> We recommend that you instead try the samples in the DBRJS samples repository https://github.com/Dynamsoft/barcode-reader-javascript-samples.
>
> The demo itself is based on Vue, you can find a simple Vue sample at https://github.com/Dynamsoft/barcode-reader-javascript-samples/tree/main/hello-world/vue

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

    > If you don't have a license yet, you can request a 30-day free trial using the following link: [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?ver=10.2.10&utm_source=demoReadMe&product=dbr&package=js).
    >
    > Alternatively, you can skip this step and still test the demo for up to 24 hours without a license.

    Open "src/dynamsoft.config.ts" and input your license key in this line:

    ```js
    LicenseManager.initLicense("YOUR_LICENSE_KEY_HERE");
    ```

3. Run

    For development:

    ```cmd
    npm run dev
    ```
    or
    ```cmd
    yarn dev
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
