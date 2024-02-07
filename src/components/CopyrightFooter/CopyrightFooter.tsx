import Logo from "../../assets/image/dynamsoft-logo.png";
import './CopyrightFooter.css';

function CopyrightFooter() {
  return (
    <footer className="footer-copyright">
      <a className="a-website-link" href="https://www.dynamsoft.com/" target="_blank" rel="noreferrer">
        <img className="img-logo" src={Logo} alt="Dynamsoft" />
      </a>
      <div className="div-text-container">
        <div>
          <span>© 2003 – {new Date().getUTCFullYear()} Dynamsoft. All rights reserved. </span>
          <a href="https://www.dynamsoft.com/privacy-statement/" target="_blank" rel="noreferrer">Privacy Statement</a>
          <span> / </span>
          <a href="https://www.dynamsoft.com/sitemap/" target="_blank" rel="noreferrer">Site Map</a>.
        </div>
        {/* -----------ignore this part when uploading to github ↓------------ */}
        <div>
          <span>This site is protected by reCAPTCHA and the Google </span>
          <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
          <span> and </span>
          <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms of Service</a>
          <span> apply.</span>
        </div>
        {/* -----------ignore this part when uploading to github ↓------------ */}
      </div>
    </footer>
  );
}

export default CopyrightFooter;
