import React, { useEffect, useState } from "react";

import { Table } from "antd";
import axios from "axios";

import OutlierGraph from "../outlier-graph";
import PathConstants from "../routes/pathConstants";

const serverUrl = process.env.REACT_APP_SERVER_URL;

function DataQualityTable({ sites, series }) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        const flattenedData = serverData.data
          .reduce((acc, siteGroup) => {
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
          }, [])
          .sort((a, b) => b.start.localeCompare(a.start));

        setData(flattenedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching outlier data:", error);
      }
    };
    if (sites.length > 0) {
      loadData();
    }
  }, [sites]);

  useEffect(() => {
    const processData = () => {
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
          filters: data
            .reduce((acc, outlier) => acc.concat(outlier.site_code), [])
            .filter((i, x, s) => s.indexOf(i) === x)
            .sort((a, b) => a.localeCompare(b))
            .map((site_code) => {
              return { text: site_code, value: site_code };
            }),
          filterSearch: true,
          onFilter: (value, record) =>
            record.site_code.toLowerCase().includes(value.toLowerCase()),
        },
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          render: (text) => <p>{text}</p>,
          filters: data
            .reduce((acc, outlier) => acc.concat(outlier.name), [])
            .filter((i, x, s) => s.indexOf(i) === x)
            .sort((a, b) => a.localeCompare(b))
            .map((name) => {
              return { text: name, value: name };
            }),
          filterSearch: true,
          onFilter: (value, record) =>
            record.name.toLowerCase().includes(value.toLowerCase()),
        },
        {
          title: "Start",
          dataIndex: "start",
          key: "start",
          showSorterTooltip: {
            target: "full-header",
          },
          render: (text) => <p>{text}</p>,
          sorter: (a, b) => a.start.localeCompare(b.start),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "End",
          dataIndex: "end",
          key: "end",
          showSorterTooltip: {
            target: "full-header",
          },
          render: (text) => <p>{text}</p>,
          sorter: (a, b) => a.end.localeCompare(b.end),
          sortDirections: ["descend", "ascend"],
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
      ];
      setColumns(columns);
    };

    processData();
  }, [data]);

  return <Table loading={isLoading} dataSource={data} columns={columns} />;
}

export default React.memo(DataQualityTable);
