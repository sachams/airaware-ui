import React, { useState } from "react";
import Navbar from "./navbar";
import ComparePanel from "./compare-panel";
import HomePanel from "./home-panel";
import ReportPanel from "./report-panel";
import NodePanel from "./node-panel";
import {
  Drawer,
  RadioGroup,
  Radio,
  ButtonToolbar,
  Button,
  Placeholder,
} from "rsuite";

import "./side-panel.css";
import { select } from "@observablehq/plot";

function SidePanel({ siteData, selectedNode, onClose }) {
  const [activeTab, setActiveTab] = useState("node");

  const onActiveTabSelect = (activeTab) => {
    setActiveTab(activeTab);
  };

  return (
    <Drawer size="lg" backdrop={true} open={!!selectedNode} onClose={onClose}>
      <Drawer.Header>
        <Drawer.Title>{selectedNode?.name}</Drawer.Title>
        <Drawer.Actions>
          <Navbar active={activeTab} onSelect={onActiveTabSelect} />
        </Drawer.Actions>
      </Drawer.Header>
      <Drawer.Body>
        {activeTab === "node" && (
          <NodePanel siteData={siteData} selectedNode={selectedNode} />
        )}
        {activeTab === "compare" && (
          <ComparePanel siteData={siteData} selectedNode={selectedNode} />
        )}
        {activeTab === "report" && <ReportPanel primaryNode={selectedNode} />}
      </Drawer.Body>
    </Drawer>
  );
}

export default React.memo(SidePanel);
