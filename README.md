# Dynamsoft Web Barcode Reader Scanning and Driver License Scanning Demo

This repository contains the source code of the online demo of [Dynamsoft Barcode Reader JavaScript Edition](https://www.dynamsoft.com/barcode-reader/sdk-javascript/), a web-based barcode reader SDK which enables you to quickly add online barcode scanning to your web application. 

Try the online demos at the links below:
- [web-based barcode scanning](https://demo.dynamsoft.com/barcode-reader-js/): the main demo entry
- [scan driver license online](https://demo.dynamsoft.com/barcode-reader-js/#driverslicense): online demo for web-based driver license scanning and parsing which uses Dynamsoft Barcode Reader JavaScript SDK for PDF417 scanning along with [Dynamsoft Code Parser](https://www.dynamsoft.com/code-parser/docs/introduction/?ver=latest) for driver license parsing

> NOTE:
>
> This project includes a big part of UI-related source code for demoing purposes.
>
> To create your own web barcode scanning application, we recommend you start with the simple samples:
> 
> - [sample repository of Dynamsoft Barcode Reader JavaScript Edition](https://github.com/Dynamsoft/barcode-reader-javascript-samples)
> - [driver license scanning in JavaScript sample](https://github.com/Dynamsoft/barcode-reader-javascript-samples/blob/main/4.use-case/2.read-a-drivers-license.html)

## Run the project

To get this demo project running, you can follow the steps below:

1. Set up

    ```cmd
    npm install
    ```
    or
    
    ```cmd
    yarn install
    ```

2. Add license

    A default license is included which allows you to test the demo for up to 24 hours. You can [request a trial license](https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&package=js) via Dynamsoft customer portal to evaluate further.

    Open `src/dbr.js` and input your license key in this line:

    ```js
    BarcodeReader.license = "YOUR-LICENSE-KEY";
    ```

    If you are doing driver license scanning and parsing, also open `src/dcp.js` and input your Dynamsoft Code Parser license key in this line:

    ```js
    CodeParser.license = "YOUR-LICENSE-KEY";
    ```

3. Run

    For **development**:

    ```cmd
    npm run serve
    ```
    or
    
    ```cmd
    yarn serve
    ```
    
    For **production**:

    ```cmd
    npm run build
    ```
    or
    
    ```cmd
    yarn build
    ```

## Contact Us

If you have any questions with these samples, feel free to submit an issue or [contact us](https://www.dynamsoft.com/company/contact/).
