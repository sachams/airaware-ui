import React from "react";
import PathConstants from "./pathConstants";

const DataMap = React.lazy(() => import("../pages/datamap"));
const About = React.lazy(() => import("../pages/about"));
const ComparePanel = React.lazy(() => import("../pages/compare-panel"));
const NodePanel = React.lazy(() => import("../pages/node-panel"));
const DataSources = React.lazy(() => import("../pages/data-sources"));

const routes = [
  { path: PathConstants.NODE_MAP, element: <DataMap /> },
  { path: PathConstants.NODE_DETAIL, element: <NodePanel /> },
  { path: PathConstants.NODE_COMPARE, element: <ComparePanel /> },
  { path: PathConstants.NODE_REPORT, element: <DataMap /> },
  { path: PathConstants.DATA_SOURCES, element: <DataSources /> },
  { path: PathConstants.ABOUT, element: <About /> },
];

export default routes;
