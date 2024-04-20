import React, { useEffect, useState } from "react";

import { Table } from "antd";
import axios from "axios";

import OutlierGraph from "../outlier-graph";
import PathConstants from "../routes/pathConstants";

const serverUrl = process.env.REACT_APP_SERVER_URL;

function DataQualityTable({ sites, series }) {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching outlier data from server");

        // Load all the data asynchronously and wait for the result
        const [serverData] = await Promise.all([
          axios.get(`${serverUrl}/outlier/${series}`),
        ]);

        // Convert the array of sites into a dict, keyed by site_code
        const keyed_sites = sites.reduce((acc, site) => {
          acc[site.site_code] = site;
          return acc;
        }, {});

        // Enrich the outlier data with site name
        serverData.data.forEach((element) => {
          element.name = keyed_sites[element.site_code].name;
        });

        // Each site has a number of outlier data blocks. Flatten these into
        // individual rows
        const flattenedData = serverData.data.reduce((acc, siteGroup) => {
          siteGroup.outliers.forEach((outlier) => {
            const flattened = {
              site_code: siteGroup.site_code,
              name: siteGroup.name,
              outlier: outlier,
              start: outlier.range.start.toString().split("T")[0],
              end: outlier.range.end.toString().split("T")[0],
              key: `${siteGroup.site_code}-${outlier.range.start}-${outlier.range.end}`,
            };
            acc.push(flattened);
          });
          return acc;
        }, []);

        setData(flattenedData);
      } catch (error) {
        console.error("Error fetching outlier data:", error);
      }
    };
    if (sites.length > 0) {
      loadData();
    }
  }, [sites]);

  const columns = [
    {
      title: "Site Code",
      dataIndex: "site_code",
      key: "site_code",
      render: (text, record) => (
        <a
          href={PathConstants.NODE_DETAIL.replace(
            ":siteCode",
            record.site_code
          )}
          target="_blank"
        >
          {text}
        </a>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Chart",
      dataIndex: "Chart",
      key: "outlier",
      render: (text, record) => (
        <OutlierGraph
          data={record.outlier}
          series={series}
          siteCode={record.site_code}
          threshold={200}
        />
      ),
    },
    {
      title: "Start",
      dataIndex: "start",
      key: "start",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "End",
      dataIndex: "end",
      key: "end",
      render: (text) => <p>{text}</p>,
    },
  ];

  return <>{data && <Table dataSource={data} columns={columns} />}</>;
}

export default React.memo(DataQualityTable);
