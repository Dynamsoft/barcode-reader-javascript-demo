import { useState } from "react";
import Option from "./Option/Option";
import VINIcon from "../../../assets/image/vin-icon.svg";
import DPMIcon from "../../../assets/image/dpm-icon.svg";
import "./Selection.css";

enum UseCase {
  ONED,
  TWOD,
  ONED_TWOD,
  DL,
  VIN,
  DPM,
}

function Selection() {
  const [selection, setSelection] = useState(UseCase.ONED_TWOD);

  const onSelect = (useCase: UseCase) => {
    setSelection(useCase);
  };

  return (
    <div className="div-selection">
      <div className="div-1d-option-container" onClick={() => onSelect(UseCase.ONED)}>
        <Option checked={selection === UseCase.ONED}>
          <div className="div-option-title">Common 1D Barcodes</div>
          <div className="div-option-info">
            Code 39, Code 128, Code 93, Codabar, EAN 13, EAN 8, UPC A, UPCE,
            Industrial 25, Code39 Extended, MSI Code
          </div>
        </Option>
      </div>
      <div className="div-2d-option-container" onClick={() => onSelect(UseCase.TWOD)}>
        <Option checked={selection === UseCase.TWOD}>
          <div className="div-option-title">Common 2D barcodes</div>
          <div className="div-option-info">QR Code, Data Matrix, PDF417</div>
        </Option>
      </div>
      <div className="div-1d-2d-option-container" onClick={() => onSelect(UseCase.ONED_TWOD)}>
        <Option checked={selection === UseCase.ONED_TWOD}>
          <div className="div-option-title">Common 1D + 2D</div>
        </Option>
      </div>
      <div className="div-dl-option-container" onClick={() => onSelect(UseCase.DL)}>
        <Option checked={selection === UseCase.DL}>
          <div className="div-option-title">USA/CAN/ZA Driver's License</div>
        </Option>
      </div>
      <div className="div-vin-option-container" onClick={() => onSelect(UseCase.VIN)}>
        <Option checked={selection === UseCase.VIN}>
          <div className="div-option-title">
            <span>VIN</span>
            <img className="img-vin-logo invert" src={VINIcon} alt="VIN" />
          </div>
        </Option>
      </div>
      <div className="div-dpm-option-container" onClick={() => onSelect(UseCase.DPM)}>
        <Option checked={selection === UseCase.DPM}>
          <div className="div-option-title">
            <span>DPM Codes</span>
            <img className="img-dpm-logo invert" src={DPMIcon} alt="DPM" />
          </div>
          <div className="div-option-info">
            <span>Support Data Matrix only</span>
            <br></br>
            <img className="img-dpm-logo invert" src={DPMIcon} alt="DPM" />
          </div>
        </Option>
      </div>
    </div>
  );
}

export default Selection;
