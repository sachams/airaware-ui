import React, { useState } from "react";
import Navbar from "./navbar";
import ComparePanel from "./compare-panel";
import HomePanel from "./home-panel";
import ReportPanel from "./report-panel";
import NodePanel from "./node-panel";

import "./side-panel.css";

function SidePanel({ siteData, selectedNode }) {
  const [activeTab, setActiveTab] = useState("home");

  const onActiveTabSelect = (activeTab) => {
    setActiveTab(activeTab);
  };

  return (
    <div className="side-panel">
      <Navbar active={activeTab} onSelect={onActiveTabSelect} />
      {activeTab === "home" && <HomePanel />}
      {activeTab === "node" && (
        <NodePanel siteData={siteData} selectedNode={selectedNode} />
      )}
      {activeTab === "compare" && (
        <ComparePanel siteData={siteData} selectedNode={selectedNode} />
      )}
      {activeTab === "report" && <ReportPanel selectedNode={selectedNode} />}
    </div>
  );
}

export default React.memo(SidePanel);
