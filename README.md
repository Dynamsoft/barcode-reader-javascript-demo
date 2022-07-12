# Dynamsoft Barcode Reader JavaScript Edition Demo

This repository contains the source code for the demo of Dynamsoft Barcode Reader JavaScript Edition (DBRJS). You can try the demo from this link:
https://demo.dynamsoft.com/barcode-reader-js/.

> NOTE
>
> A big part of the source code is dedicated to making a better UI or creating better user experience for demoing purposes, which might be distracting if you intend to learn about the SDK and its basic usage.
>
> We recommend that you instead try the samples in the DBRJS samples repository https://github.com/Dynamsoft/barcode-reader-javascript-samples.
>
> The demo itself is based on Vue, you can find a simple Vue sample at https://github.com/Dynamsoft/barcode-reader-javascript-samples/tree/main/1.hello-world/5.read-video-vue

If you would like to get this demo project running, you can follow the steps below:

## Try the project

1. Set up

    ```cmd
    yarn
    ```

2. Add a license key

    Open "src/dbr.js" and input your license key in this line:

    ```js
    BarcodeReader.license = "YOUR-LICENSE-KEY";
    ```

3. Compiles and hot-reloads for development

    ```cmd
    yarn serve
    ```

4. Compiles and minifies for production

    ```cmd
    yarn build
    ```

## Contact Us

If you have any questions with these samples, feel free to submit an issue or [contact us](https://www.dynamsoft.com/company/contact/).
