import "./comparison-graph.css";

import * as React from "react";
import { useEffect, useRef, useState } from "react";

import { Skeleton } from "antd";
import axios from "axios";

import { DotChartOutlined } from "@ant-design/icons";
import * as Plot from "@observablehq/plot";

import { comparisonNodeColour, primaryNodeColour } from "./mapStyle";
import { getSeriesName } from "./utils";

const serverUrl = process.env.REACT_APP_SERVER_URL;

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function ComparisonGraph(props) {
  const { primaryNode, comparisonNodes, series, dateRange, frequency } = props;

  const containerRef = useRef();
  const [primaryData, setPrimaryData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [startDate, endDate] = dateRange;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching primary series data from server");
        setIsLoading(true);

        // Load all the data asynchronously and wait for the result
        const [primaryData] = await Promise.all([
          axios.get(
            `${serverUrl}/sensor/${series}/${startDate.toISOString()}/${endDate.toISOString()}/${frequency}?codes=${
              primaryNode.site_code
            }`
          ),
        ]);

        await delay(1000);

        const data = primaryData.data.map((d) => ({
          time: new Date(d.time),
          value: d.value,
          type: "Node",
        }));

        setIsLoading(false);
        setPrimaryData(data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    if (primaryNode) {
      loadData();
    } else {
      setPrimaryData([]);
    }
  }, [primaryNode, series, startDate, endDate, frequency]);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching comparison series data from server");
        setIsLoading(true);

        // Load all the data asynchronously and wait for the result
        const [comparisonData] = await Promise.all([
          axios.get(
            `${serverUrl}/sensor/${series}/${startDate.toISOString()}/${endDate.toISOString()}/${frequency}?${comparisonNodes
              .filter((node) => {
                return node.site_code !== primaryNode.site_code;
              })
              .map((node) => "codes=" + node.site_code)
              .join("&")}`
          ),
        ]);

        const data = comparisonData.data.map((d) => ({
          time: new Date(d.time),
          value: d.value,
          type: "Comparison",
        }));
        setIsLoading(false);
        setComparisonData(data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    if (comparisonNodes.length > 0) {
      loadData();
    } else {
      setComparisonData([]);
    }
  }, [comparisonNodes, series, startDate, endDate, frequency]);

  useEffect(() => {
    if (!primaryNode || !comparisonNodes || !containerRef.current) {
      return;
    }
    const data = primaryData.concat(comparisonData);

    if (data.length === 0) return;

    const plot = Plot.plot({
      color: {
        legend: true,
        domain: ["Comparison", "Node"],
        range: [comparisonNodeColour, primaryNodeColour],
      },
      marginLeft: 60,
      marginBottom: 40,
      y: {
        label: `${getSeriesName(series)} concentration (ug/m3)`,
        labelAnchor: "center",
      },
      style: {
        fontSize: 16,
      },
      // color: { legend: true, scheme: "Set2" },
      title: `${getSeriesName(series)} concentration`,
      subtitle: "Dotted lines show average readings",
      marks: [
        Plot.ruleY([0]),
        Plot.ruleX(data, Plot.pointerX({ x: "time", stroke: "red" })),

        Plot.dot(
          data.filter((d) => d.type === "Node"),
          Plot.pointerX({ x: "time", y: "value", stroke: "type" })
        ),
        Plot.dot(
          data.filter((d) => d.type === "Comparison"),
          Plot.pointerX({ x: "time", y: "value", stroke: "type" })
        ),

        Plot.text(
          data.filter((d) => d.type === "Comparison"),
          Plot.pointerX({
            x: "time",
            frameAnchor: "top-left",
            dx: 10,
            dy: 0,
            fontVariant: "tabular-nums",
            text: (d) => `${d.time.toLocaleString()}`,
          })
        ),
        Plot.text(
          data.filter((d) => d.type === "Node"),
          Plot.pointerX({
            x: "time",
            frameAnchor: "top-left",
            dx: 10,
            dy: 20,
            fontVariant: "tabular-nums",
            text: (d) => `${d.type}: ${d.value.toFixed(2)}`,
          })
        ),
        Plot.text(
          data.filter((d) => d.type === "Comparison"),
          Plot.pointerX({
            x: "time",
            frameAnchor: "top-left",
            dx: 10,
            dy: 40,
            fontVariant: "tabular-nums",
            text: (d) => `${d.type}: ${d.value.toFixed(2)}`,
          })
        ),

        Plot.line(data, {
          x: { type: "time", value: "time" },
          y: {
            value: "value",
            label: `${getSeriesName(series)} concentration (ug/m3)`,
          },
          title: (d) => `${d.time} - ${d.value}`,
          stroke: "type",
        }),
        // Add primary average line
        Plot.ruleY(
          data.filter((d) => d.type === "Node"),
          Plot.groupZ(
            { y: "mean" },
            {
              y: (d) => d.value,
              stroke: primaryNodeColour,
              strokeWidth: 2,
              strokeDasharray: "4",
            }
          )
        ),
        // Add comparison average line
        Plot.ruleY(
          data.filter((d) => d.type === "Comparison"),
          Plot.groupZ(
            { y: "mean" },
            {
              y: (d) => d.value,
              stroke: comparisonNodeColour,
              strokeWidth: 2,
              strokeDasharray: "4",
            }
          )
        ),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, [primaryData, comparisonData]);

  return (
    <div>
      {!isLoading && <div className="comparison-graph" ref={containerRef} />}
      {isLoading && (
        <Skeleton.Node
          active={true}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "100%",
            height: "300px",
          }}
        >
          <DotChartOutlined style={{ fontSize: 40, color: "#bfbfbf" }} />
        </Skeleton.Node>
      )}
    </div>
  );
}

export default React.memo(ComparisonGraph);
