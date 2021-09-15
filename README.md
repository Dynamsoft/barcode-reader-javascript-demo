# Demo for Dynamsoft Barcode Reader JavaScript SDK

This repository contains the source code for the official demo of the Dynamsoft Barcode Reader JavaScript SDK (hereafter called "the library"). 

You can visit the official demo at [https://demo.dynamsoft.com/barcode-reader-js/](https://demo.dynamsoft.com/barcode-reader-js/).

The application is based on [Vue](https://vuejs.org/), a progressive framework for building user interfaces. You can follow the steps below to run the application.

> Make sure you have [node](https://nodejs.org/), [yarn](https://yarnpkg.com/cli/install) and [Vue CLI](https://cli.vuejs.org/) installed. `node 14.16.0` , `yarn 1.22.10` and `@vue/cli 4.5.11` are used in the example below. 

## Install the dependencies

```
yarn
```

## Compile and serve

```
yarn serve
```

You will notice that the barcode results are not complete and sometimes the location is not accurate, both issues are due to the lack of a valid license. The next step show you how to apply for a trial license and use it.

## License the application

Sign up and request a trial license in the [Dynamsoft Customer Portal](https://www.dynamsoft.com/customer/license/trialLicense). Make sure to choose "Dynamsoft Barcode Reader" and "JavaScript Web SDK".

Once you get the trial license, you can use it by specifying your organization ID in the application.

Open the file /src/dbr.js and specify your organization ID like this:

```javascript
DBR.BarcodeReader.organizationID = "Your-Organization-ID";
```

That's it. Recompile to test again and you will see the barcode reading working properly.

> NOTE
> 
> The trial license is fetched from Dynamsoft License Server at runtime, so make sure your device has network connection, otherwise, it won't work.