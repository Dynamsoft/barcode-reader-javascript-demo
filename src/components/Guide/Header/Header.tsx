import Logo from "../../../assets/image/dynamsoft-logo.png";
import LiveChatButton from "../../LiveChatButton/LiveChatButton";
import './Header.css';

function Header() {
  return (
    <header className="header">
      <a className="a-website-link" href="https://www.dynamsoft.com/" target="_blank" rel="noreferrer">
        <img className="img-logo" src={Logo} alt="Dynamsoft" />
        dynamsoft
      </a>
      {/* -----------ignore this part when uploading to github ↓------------ */}
      <div className="div-live-chat-container">
        <LiveChatButton></LiveChatButton>
      </div>
      {/* -----------ignore this part when uploading to github ↑------------ */}
    </header>
  );
}

export default Header;
