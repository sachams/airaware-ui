import React, { useEffect, useState } from "react";

import { Table } from "antd";
import axios from "axios";

import OutlierGraph from "../outlier-graph";
import PathConstants from "../routes/pathConstants";

const serverUrl = process.env.REACT_APP_SERVER_URL;

function DataQuality({ sites }) {
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching outlier data from server");
        setIsLoading(true);

        // Load all the data asynchronously and wait for the result
        const [pm25Data, no2Data] = await Promise.all([
          axios.get(`${serverUrl}/outlier/pm25`),
          axios.get(`${serverUrl}/outlier/no2`),
        ]);

        // Convert the array of sites into a dict, keyed by site_code
        const keyed_sites = sites.reduce((acc, site) => {
          acc[site.site_code] = site;
          return acc;
        }, {});

        // Enrich the outlier data with site name
        pm25Data.data.forEach((element) => {
          element.name = keyed_sites[element.site_code].name;
        });
        no2Data.data.forEach((element) => {
          element.name = keyed_sites[element.site_code].name;
        });

        // Each site has a number of outlier data blocks. Flatten these into
        // individual rows
        const pm25DataFlattened = pm25Data.data.reduce((acc, siteGroup) => {
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

        const no2DataFlattened = no2Data.data.reduce((acc, siteGroup) => {
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

        setData({ pm25: pm25DataFlattened, no2: no2DataFlattened });
        setIsLoading(false);
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
          series={"pm25"}
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

  return <>{data && <Table dataSource={data.pm25} columns={columns} />}</>;
}

export default React.memo(DataQuality);
