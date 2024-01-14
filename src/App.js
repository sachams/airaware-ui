import "./App.css";
import { Routes, Route } from "react-router-dom";
import DataMap from "./datamap";
import Wrapped from "./wrapped";
import NoMatch from "./no-match";
import React, { useState, useEffect } from "react";
import { Button, Modal } from "rsuite";
import logo from "./img/logo-menu.png";
import axios from "axios";
import set from "date-fns/set";
import ComparePanel from "./compare-panel";
import subDays from "date-fns/subDays";
import ReportPanel from "./report-panel";
import NodePanel from "./node-panel";
import DataSources from "./data-sources";
import About from "./about";
import WrappedDrawer from "./wrapped-drawer";

import { Layout, Menu, theme } from "antd";
const { Header, Content, Footer, Sider } = Layout;
const serverUrl = process.env.REACT_APP_SERVER_URL;

const mainMenuItems = [
  { key: "nodeMap", label: "Node map" },
  { key: "city", label: "City" },
  { key: "dataSources", label: "Data sources" },
  { key: "about", label: "About" },
];

const topMenuItems = [
  { key: "details", label: "Details" },
  { key: "compare", label: "Compare" },
  { key: "report", label: "Report" },
  { key: "wrapped", label: "Wrapped 2023" },
];

function App() {
  const {
    token: { colorBgContainer, borderRadius },
  } = theme.useToken();

  const [modalOpen, setModalOpen] = useState(true);
  const [showWrapped, setShowWrapped] = useState(true);
  const [selectedNode, setSelectedNode] = useState(undefined);
  const [selectedMainMenuKeys, setSelectedMainMenuKeys] = useState(["nodeMap"]);
  const [selectedTopMenuKeys, setSelectedTopMenuKeys] = useState([]);

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

  const handleShowWrapped = () => {
    setModalOpen(false);
    setShowWrapped(true);
    document.body.classList.remove("bg-image-welcome");
  };
  const handleShowDatamap = () => {
    setModalOpen(false);
    setShowWrapped(false);
    document.body.classList.remove("bg-image-welcome");
  };

  const [sites, setSites] = useState(undefined);

  useEffect(() => {
    const loadSiteData = async () => {
      try {
        console.log("Fetching site data from the server");

        // Load all the data asynchronously and wait for the result
        const sitesResponse = await axios.get(`${serverUrl}/sites`);

        setSites(sitesResponse.data);
      } catch (error) {
        console.error("Error fetching site data:", error);
      }
    };

    loadSiteData();
  }, []);

  // <Routes>
  //   <Route path="/" element={<DataMap />} />
  //   <Route path="/wrapped" element={<Wrapped year={2023} />} />
  //   <Route path="*" element={<NoMatch />} />
  // </Routes>
  // <img src={logo} className="logo" />

  const onMapNodeSelected = (node) => {
    console.log("Selected ", node);
    setSelectedMainMenuKeys([]);
    setSelectedTopMenuKeys(["details"]);
    setSelectedNode(node);
  };
  const onTopMenuSelected = (item) => {
    setSelectedTopMenuKeys(item.selectedKeys);
    console.log("Top menu selected ", item);
  };
  const onMainMenuSelected = (item) => {
    setSelectedNode(undefined);
    setSelectedMainMenuKeys(item.selectedKeys);
    console.log("Main menu selected ", item);
  };

  const onWrappedClose = () => {
    setSelectedTopMenuKeys(["details"]);
  };

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <img src={logo} className="logo" />
        <Menu
          mode="inline"
          items={mainMenuItems}
          onSelect={onMainMenuSelected}
          selectedKeys={selectedMainMenuKeys}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {selectedNode && (
            <Menu
              mode="horizontal"
              items={topMenuItems}
              style={{ flex: 1, minWidth: 0 }}
              onSelect={onTopMenuSelected}
              selectedKeys={selectedTopMenuKeys}
            />
          )}
        </Header>
        <Content style={{ margin: "16px 16px 0", borderRadius: borderRadius }}>
          {!selectedNode && selectedMainMenuKeys.includes("nodeMap") && (
            <DataMap sites={sites} onNodeSelected={onMapNodeSelected} />
          )}
          {!selectedNode && selectedMainMenuKeys.includes("dataSources") && (
            <DataSources />
          )}
          {!selectedNode && selectedMainMenuKeys.includes("about") && <About />}

          {selectedNode && selectedTopMenuKeys.includes("details") && (
            <NodePanel selectedNode={selectedNode} />
          )}
          {selectedNode && selectedTopMenuKeys.includes("compare") && (
            <ComparePanel
              sites={sites}
              selectedNode={selectedNode}
              dateRange={dateRange}
              onDateChange={onDateChange}
            />
          )}
          {selectedNode && selectedTopMenuKeys.includes("report") && (
            <ReportPanel
              primaryNode={selectedNode}
              dateRange={dateRange}
              onDateChange={onDateChange}
            />
          )}
          <WrappedDrawer
            selectedNode={
              selectedNode && selectedTopMenuKeys.includes("wrapped")
            }
            year={2023}
            onClose={onWrappedClose}
          />
        </Content>
      </Layout>
    </Layout>
  );
}

// {showWrapped && !modalOpen && <Wrapped year={2023} />}
// {!showWrapped && !modalOpen && <DataMap />}

export default App;
