import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Suspense } from "react";

export default function AppLayout() {
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
        <Content
          style={{ margin: "16px 16px 0", borderRadius: borderRadius }}
        ></Content>
      </Layout>
    </Layout>
  );
}
