import React from "react";

import { Tabs } from "antd";

import DataQualityTable from "./data-quality-table";

const serverUrl = process.env.REACT_APP_SERVER_URL;

function DataQualityPanel({ sites }) {
  return (
    <Tabs
      type="card"
      items={[
        {
          label: "PM2.5",
          key: 1,
          children: <DataQualityTable sites={sites} series={"pm25"} />,
        },
        {
          label: "NO2",
          key: 2,
          children: <DataQualityTable sites={sites} series={"no2"} />,
        },
      ]}
    />
  );
}

export default React.memo(DataQualityPanel);
