import { useRef, useState } from 'react';
import LiveChatButton from '../../LiveChatButton/LiveChatButton'
import CameraIcon from "../../../assets/image/camera-icon.svg";
import UploadImageIcon from "../../../assets/image/upload-image-icon.svg";
import SoundEffectOnIcon from "../../../assets/image/sound-effect-on-icon.svg";
import SoundEffectOffIcon from "../../../assets/image/sound-effect-off-icon.svg";
// import GetSourceCodeIcon from "../../../assets/image/get-source-code-icon.svg";
import "./Header.css";

function Header() {
  const [soundEffectOn, setSoundEffectOn] = useState(true);
  const [cameraDropdownVisible, setCameraDropdownVisible] = useState(false);
  const refLiveChat = useRef(null);

  const switchCameraDropdown = () => {
    setCameraDropdownVisible(!cameraDropdownVisible);
  };

  const switchSoundEffect = () => {
    setSoundEffectOn(!soundEffectOn);
  };

  return (
    <div className="header">
      <div className="div-header-left">
        <div className="div-camera-dropdown-container" onClick={switchCameraDropdown}>
          <div className="div-camera-icon-container">
            <img className="img-camera-icon" src={CameraIcon} alt="Camera"></img>
            <span className="span-text">Camera</span>
          </div>
          <div className="div-arrow-container"></div>
          <div className="div-current-camera-name"></div>
          <ul className={`ul-camera-list${cameraDropdownVisible ? " show" : ""}`}>
            <li className="li-camera-option selected">OBS-Camera(HD)</li>
            <li className="li-camera-option">OBS-Camera(FULL HD)</li>
          </ul>
        </div>
        <div className="div-image-container div-upload-image-button-container">
          <img className="img-upload-image-icon" src={UploadImageIcon} alt="Upload Image"></img>
        </div>
        <div className={`div-image-container div-sound-effect-button-container${soundEffectOn ? " sound-effect-on" : " sound-effect-off"}`} onClick={switchSoundEffect}>
          <img className="img-sound-effect-icon" src={soundEffectOn ? SoundEffectOnIcon : SoundEffectOffIcon} alt="Sound Effect"></img>
        </div>
        <div className="div-image-container div-live-chat-button-container" onClick={()=>(refLiveChat.current as any).openLiveChat()}>
          <div className="div-live-chat-button">
            <LiveChatButton ref={refLiveChat} ></LiveChatButton>
          </div>
        </div>
      </div>
      <div className="div-header-right">
        <a className="a-source-code-link" href="https://github.com/Dynamsoft/barcode-reader-javascript-demo" target="_blank" rel="noreferrer">
          GET DEMO CODE
          {/* <img className="img-get-source-code-icon" src={GetSourceCodeIcon} alt="Get Source Code"></img> */}
          <div className="div-get-source-code-icon"></div>
        </a>
        <a className="a-download-sdk" href="https://www.dynamsoft.com/barcode-reader/downloads/#javascript" target="_blank" rel="noreferrer">
          DOWNLOAD SDK
        </a>
      </div>
    </div>
  );
}

export default Header;
