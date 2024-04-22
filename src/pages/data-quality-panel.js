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
          label: "Overview",
          key: 0,
          children: (
            <div>
              <p>
                Data from the Breathe London nodes comes from small, low-cost
                sensors that have correction factors applied to them from a
                network of reference monitors to improve their accuracy. You can
                read more about this process{" "}
                <a
                  href="https://www.breathelondon.org/network-accuracy"
                  target="_blank"
                  rel="noreferrer"
                >
                  here
                </a>
                .
              </p>
              <p>
                Anomalous high readings do occur, and it can be difficult to
                distinguish real high readings from false ones. The PM2.5 and
                NO2 tabs show all readings that are greater than 200ug/m3,
                plotted with a day of context either side of the data. Before
                using any data from this website, please consider whether these
                readings might affect the outcomes of your analysis.
              </p>
            </div>
          ),
        },
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
