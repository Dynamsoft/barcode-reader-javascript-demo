import Header from "./Header/Header";
import CopyrightFooter from "../CopyrightFooter/CopyrightFooter";
import './Capture.css';

function Capture() {
  return (
    <div className="div-capture">
      <div className="div-video-container"></div>
      <div className="div-footer-container">
        <CopyrightFooter></CopyrightFooter>
      </div>
      <div className="div-settings-container">
      </div>
      <div className="div-header-container">
        <Header></Header>
      </div>
    </div>
  );
}

export default Capture;
