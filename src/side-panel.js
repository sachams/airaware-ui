import React, { useState } from "react";
import Navbar from "./navbar";
import ComparePanel from "./compare-panel";
import subDays from "date-fns/subDays";
import set from "date-fns/set";
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

  const defaultEndDate = set(new Date(), {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  const [dateRange, setDateRange] = useState([
    subDays(defaultEndDate, 30),
    defaultEndDate,
  ]);

  const onDateChange = (dateRange) => {
    setDateRange(dateRange);
  };

  const onActiveTabSelect = (activeTab) => {
    setActiveTab(activeTab);
  };

  return (
    <Drawer size="full" backdrop={true} open={!!selectedNode} onClose={onClose}>
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
          <ComparePanel
            siteData={siteData}
            selectedNode={selectedNode}
            dateRange={dateRange}
            onDateChange={onDateChange}
          />
        )}
        {activeTab === "report" && (
          <ReportPanel
            primaryNode={selectedNode}
            dateRange={dateRange}
            onDateChange={onDateChange}
          />
        )}
      </Drawer.Body>
    </Drawer>
  );
}

export default React.memo(SidePanel);
