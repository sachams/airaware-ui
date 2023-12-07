import React from "react";
import "./home-panel.css";

function HomePanel() {
  return (
    <div className="home-panel">
      <p>Welcome to AirAware</p>
    </div>
  );
}

export default React.memo(HomePanel);
