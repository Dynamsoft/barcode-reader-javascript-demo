import Header from "./Header/Header";
import Selection from "./Selection/Selection";
import CopyrightFooter from "../CopyrightFooter/CopyrightFooter";
import DBRLogo from "../../assets/image/dbr-log.svg";
import "./Guide.css";

function Guide() {
  return (
    <div className="div-guide">
      <div className="div-header-container">
        <Header></Header>
      </div>
      <div className="div-body">
        <div className="div-title-container">
          <div className="div-title">
            <h1>Dynamsoft Barcode Reader | JavaScript Barcode Reader Demo</h1>
            <img className="img-dbr-logo" src={DBRLogo} alt="dynamsoft-barcode-reader" />
          </div>
        </div>
        <div className="div-introduction-container">
          Using Dynamsoft Barcode Reader JavaScript Edition, you can turn any device with a camera into an enterprise-grade barcode scanner with high-speed functionalities and customization settings for different usage scenarios. Take this JavaScript barcode scanner demo and see how it works in different modes.
        </div>
        <div className="div-selection-container">
          <div className="div-text">
            To experience online barcode scanning, select a mode below and start scannning
          </div>
          <Selection></Selection>
        </div>
        <div className="div-button-container">
          <button className="btn-start">START SCAN</button>
        </div>
        <div className="div-info-container">
          <div className="div-info">
            <div className="div-introduction">
              Using Dynamsoft Barcode Reader JavaScript Edition, you can turn any device with a camera into an enterprise-grade barcode scanner with high-speed functionalities and customization settings for different usage scenarios. Take this JavaScript barcode scanner demo and see how it works in different modes.
            </div>
            <div className="div-browsers-info">
              Supported Browsers: Safari v11+, Chrome v59+, Firefox v52+ (v55+ on Android/iOS) and Edge v16+ on Desktop/Android/iOS.
            </div>
            {/* -----------ignore this part when uploading to github ↓------------ */}
            <div className="div-reCAPTCHA-info">
              <span>This site is protected by reCAPTCHA and the Google </span>
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
              <span> and </span>
              <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms of Service</a>
              <span> apply.</span>
            </div>
            {/* -----------ignore this part when uploading to github ↑------------ */}
          </div>
        </div>
      </div>
      <div className="div-footer-container">
        <CopyrightFooter></CopyrightFooter>
      </div>
    </div>
  );
}

export default Guide;
