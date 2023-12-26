import * as React from "react";
import "./wrapped-final.css";
import "./wrapped-panel.css";
import WrappedPanel from "./wrapped-panel";

function WrappedFinal() {
  return (
    <WrappedPanel>
      <p className="wrapped-final-text">
        Thanks for stopping by! If you would like to know more about air
        quality, please see our{" "}
        <a href="https://airaware.substack.com" target="_blank">
          Air Aware blog.
        </a>
      </p>
    </WrappedPanel>
  );
}

export default React.memo(WrappedFinal);
