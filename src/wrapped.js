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

import "./wrapped.css";

function Wrapped({ siteData, selectedNode, onClose }) {
  const [activeTab, setActiveTab] = useState("node");

  const onActiveTabSelect = (activeTab) => {
    setActiveTab(activeTab);
  };

  return <Wrapped></Wrapped>;
}

export default React.memo(SidePanel);
