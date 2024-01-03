import "./App.css";
import { Routes, Route } from "react-router-dom";
import DataMap from "./datamap";
import Wrapped from "./wrapped";
import NoMatch from "./no-match";
import React, { useState, useEffect } from "react";
import { Button, Modal } from "rsuite";
import logo from "./img/logo-menu.png";

import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
const { Header, Content, Footer, Sider } = Layout;

const items = [
  { key: "home", label: "Home" },
  { key: "nodes", label: "Nodes" },
  { key: "city", label: "City" },
  { key: "about", label: "About" },
];
function App() {
  const {
    token: { colorBgContainer, borderRadius },
  } = theme.useToken();

  const [modalOpen, setModalOpen] = useState(true);
  const [showWrapped, setShowWrapped] = useState(true);

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

  // <Routes>
  //   <Route path="/" element={<DataMap />} />
  //   <Route path="/wrapped" element={<Wrapped year={2023} />} />
  //   <Route path="*" element={<NoMatch />} />
  // </Routes>
  // <img src={logo} className="logo" />

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
        <Menu mode="inline" defaultSelectedKeys={["4"]} items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, border: "1px solid red" }} />
        <Content style={{ margin: "16px 16px 0", borderRadius: borderRadius }}>
          <DataMap />
        </Content>
      </Layout>
    </Layout>
  );
}

// {showWrapped && !modalOpen && <Wrapped year={2023} />}
// {!showWrapped && !modalOpen && <DataMap />}

export default App;
