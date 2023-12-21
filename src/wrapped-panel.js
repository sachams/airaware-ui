import * as React from "react";
import "./wrapped-panel.css";

function WrappedPanel({ children }) {
  return <div className="wrapped-panel">{children}</div>;
}

export default WrappedPanel;
