import "./Option.css";

function Option({ children, checked }: { children: React.ReactNode | Array<React.ReactNode>, checked: boolean }) {
  const headerEl: React.ReactNode = Array.isArray(children) ? children[0] : children;
  const bodyEl: React.ReactNode = Array.isArray(children) ? children[1] : "";
// <div className="div-header">{ headerEl }</div>
      // { bodyEl ? (
      //   <div className="div-body">{ bodyEl }</div>
      // ) : ""}

  return (
    <div className={`div-option${checked ? " selected" : ""}`}>
      { headerEl }
      { bodyEl }
      <div className="div-circle">
      </div>
    </div>
  );
}

export default Option;
