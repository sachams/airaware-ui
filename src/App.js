import "./App.css";

import React, { useEffect, useState } from "react";

import { Layout, Menu, theme } from "antd";
import axios from "axios";
import set from "date-fns/set";
import subMonths from "date-fns/subMonths";
import qs from "qs";
import {
  matchRoutes,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import logo from "./img/logo-menu.png";
import NoMatch from "./no-match";
import About from "./pages/about";
import ComparePanel from "./pages/compare-panel";
import DataQualityPanel from "./pages/data-quality-panel";
import DataSources from "./pages/data-sources";
import DataMap from "./pages/datamap";
import NodePanel from "./pages/node-panel";
import ReportPanel from "./pages/report-panel";
import PathConstants from "./routes/pathConstants";
import { nullGeoJson } from "./utils";
import WrappedDrawer from "./wrapped-drawer";

const { Header, Content, Sider } = Layout;
const serverUrl = process.env.REACT_APP_SERVER_URL;

function App() {
  const location = useLocation();

  const {
    token: { borderRadius },
  } = theme.useToken();

  const navigate = useNavigate();
  const [selectedSiteCode, setSelectedSiteCode] = useState(undefined);
  const [selectedMainMenuKeys, setSelectedMainMenuKeys] = useState(["nodeMap"]);
  const [selectedTopMenuKeys, setSelectedTopMenuKeys] = useState([]);

  const defaultEndDate = set(new Date(), {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  const startDate = subMonths(defaultEndDate, 1);

  const [data, setData] = useState({
    sites: [],
    siteAverageNO2: undefined,
    siteAveragePM25: undefined,
    ltnData: nullGeoJson,
    boroughData: nullGeoJson,
    congestionData: nullGeoJson,
    lezData: nullGeoJson,
  });

  const mainMenuItems = [
    { key: PathConstants.NODE_MAP, label: "Node map" },
    {
      key: PathConstants.DATA_SOURCES,
      label: "Data sources",
    },
    {
      key: PathConstants.DATA_QUALITY,
      label: "Data quality",
    },
    { key: PathConstants.ABOUT, label: "About" },
  ];

  // A list of top menu items. When the route changes, any search params in
  // params are carried over from one route to the next. we do this
  // to (eg) maintain a common date range between pages
  const topMenuItems = [
    { key: PathConstants.NODE_DETAIL, label: "Detail", params: [] },
    {
      key: PathConstants.NODE_COMPARE,
      label: "Compare",
      params: ["startDate", "endDate"],
    },
    {
      key: PathConstants.NODE_REPORT,
      label: "Report",
      params: ["startDate", "endDate"],
    },
    {
      key: PathConstants.NODE_WRAPPED,
      label: "Wrapped 2023",
      params: [],
    },
  ];

  useEffect(() => {
    const loadSiteData = async () => {
      try {
        console.log("Fetching site data from the server");

        // Load all the data asynchronously and wait for the result
        const [
          sitesResponse,
          siteAveragePM25Response,
          siteAverageNO2Response,
          ltnDataResponse,
          boroughDataResponse,
          congestionDataResponse,
          lezDataResponse,
        ] = await Promise.all([
          axios.get(`${serverUrl}/sites`),
          axios.get(
            `${serverUrl}/site_average/pm25/${startDate.toISOString()}/${defaultEndDate.toISOString()}`
          ),
          axios.get(
            `${serverUrl}/site_average/no2/${startDate.toISOString()}/${defaultEndDate.toISOString()}`
          ),
          axios.get(`${serverUrl}/geometry/ltns`),
          axios.get(`${serverUrl}/geometry/boroughs`),
          axios.get(`${serverUrl}/geometry/cc`),
          axios.get(`${serverUrl}/geometry/lez`),
        ]);

        setData({
          sites: sitesResponse.data,
          siteAverageNO2: siteAverageNO2Response.data,
          siteAveragePM25: siteAveragePM25Response.data,
          ltnData: ltnDataResponse.data,
          boroughData: boroughDataResponse.data,
          congestionData: congestionDataResponse.data,
          lezData: lezDataResponse.data,
        });
      } catch (error) {
        console.error("Error fetching site data:", error);
      }
    };

    loadSiteData();
  }, []);

  useEffect(() => {
    console.log("Locaion is ", location);

    // Set the menu based on route
    const routes = Object.values(PathConstants).map((item) => ({
      path: item,
    }));

    // Get the base route - this should then match either a top menu or main menu route
    const matches = matchRoutes(routes, location);

    if (matches.length === 0) {
      console.log("Didn't match any routes - returning");
      setSelectedSiteCode(undefined);
      return;
    }

    console.log("Matches", matches);
    console.log("Setting selected node to ", matches[0].params.siteCode);
    setSelectedSiteCode(matches[0].params.siteCode);

    const topItem = topMenuItems.find(
      (item) => item.key === matches[0].route.path
    );

    if (topItem) {
      console.log("Setting top menu to ", matches[0].route.path);
      setSelectedTopMenuKeys(matches[0].route.path);
    } else {
      console.log("Setting top menu to null");
      setSelectedTopMenuKeys([]);
    }

    const mainItem = mainMenuItems.find(
      (item) => item.key === matches[0].route.path
    );

    if (mainItem) {
      console.log("Setting main menu to ", matches[0].route.path);
      setSelectedMainMenuKeys(matches[0].route.path);
    } else {
      console.log("Setting main menu to null");
      setSelectedMainMenuKeys([]);
    }

    console.log("Routes", routes);
  }, [location]);

  const onMapNodeSelected = (node) => {
    console.log("Selected ", node);
    navigate(
      topMenuItems
        .find((item) => item.key === PathConstants.NODE_DETAIL)
        .key.replace(":siteCode", node.site_code)
    );
  };

  // A top menu item has been selected. We want to carry over some search params
  // (eg, startDate and endDate) between pages, so extract and re-set them here.
  const onTopMenuSelected = (item) => {
    // Find the item in our original list of top menu items, so we can get the list
    // of params
    const originalItem = topMenuItems.find(
      (originalItem) => originalItem.key === item.key
    );

    const existingQueries = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });

    let newQueries = {};

    originalItem.params.forEach((query) => {
      if (existingQueries[query]) {
        newQueries = { ...newQueries, [query]: existingQueries[query] };
      }
    });

    const queryString = qs.stringify(newQueries, { skipNulls: true });

    const targetPath = `${item.key.replace(
      ":siteCode",
      selectedSiteCode
    )}?${queryString}`;
    navigate(targetPath);
  };

  const onMainMenuSelected = (item) => {
    navigate(item.key);
    console.log("Main menu selected ", item);
  };

  const onWrappedClose = () => {
    const path = topMenuItems
      .find((item) => item.key === PathConstants.NODE_DETAIL)
      .key.replace(":siteCode", selectedSiteCode);

    console.log("Navigating to ", path);
    navigate(path);
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
        <img src={logo} className="logo" alt="Air Aware logo" />
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
          {selectedTopMenuKeys.length > 0 && (
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
          <Routes>
            <Route
              path={PathConstants.NODE_MAP}
              element={
                <DataMap
                  sites={data.sites}
                  siteAverageNO2={data.siteAverageNO2}
                  siteAveragePM25={data.siteAveragePM25}
                  ltnData={data.ltnData}
                  boroughData={data.boroughData}
                  congestionData={data.congestionData}
                  lezData={data.lezData}
                  onNodeSelected={onMapNodeSelected}
                />
              }
            />
            <Route
              path={PathConstants.NODE_DETAIL}
              element={<NodePanel sites={data.sites} />}
            />
            <Route
              path={PathConstants.NODE_COMPARE}
              element={<ComparePanel sites={data.sites} />}
            />
            <Route
              path={PathConstants.NODE_REPORT}
              element={<ReportPanel sites={data.sites} />}
            />
            <Route
              path={PathConstants.NODE_WRAPPED}
              element={<WrappedDrawer year={2023} onClose={onWrappedClose} />}
            />
            <Route
              path={PathConstants.DATA_SOURCES}
              element={<DataSources />}
            />
            <Route
              path={PathConstants.DATA_QUALITY}
              element={<DataQualityPanel sites={data.sites} />}
            />
            <Route path={PathConstants.ABOUT} element={<About />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

// {showWrapped && !modalOpen && <Wrapped year={2023} />}
// {!showWrapped && !modalOpen && <DataMap />}

export default App;
