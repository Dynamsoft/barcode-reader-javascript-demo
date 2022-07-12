import { CodeParser } from "dynamsoft-code-parser";
CodeParser.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-code-parser@1.0.2/dist/";
// Please contact Dynamsoft Support (support@dynamsoft.com) to acquire a trial license for Dynamsoft Code Parser
CodeParser.license = "YOUR-LICENSE-KEY";

(async () =>{
    try {
        await CodeParser.loadWasm();
    } catch (ex) {
        const msg = ex.message || ex;
        console.error(msg);
        alert(msg);
    }
})();