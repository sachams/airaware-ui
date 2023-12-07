import axios from "axios";
import * as React from "react";
import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import { primaryNodeColour, comparisonNodeColour } from "./mapStyle";
import "./comparison-graph.css";
import { Loader } from "rsuite";

const serverUrl = process.env.REACT_APP_SERVER_URL;

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

        const data = primaryData.data.map((d) => ({
          time: new Date(d.time),
          value: d.value,
          type: primaryNode.name,
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
    if (!primaryNode || !comparisonNodes) {
      return;
    }
    const data = primaryData.concat(comparisonData);

    if (data.length == 0) return;

    const plot = Plot.plot({
      color: {
        legend: true,
        domain: ["Comparison", primaryNode.name],
        range: [comparisonNodeColour, primaryNodeColour],
      },
      // color: { legend: true, scheme: "Set2" },
      title: `${series.toUpperCase()} concentration`,
      marks: [
        Plot.ruleY([0]),
        Plot.ruleX(data, Plot.pointerX({ x: "time", stroke: "red" })),

        Plot.dot(
          data.filter((d) => d.type == primaryNode.name),
          Plot.pointerX({ x: "time", y: "value", stroke: "type" })
        ),
        Plot.dot(
          data.filter((d) => d.type == "Comparison"),
          Plot.pointerX({ x: "time", y: "value", stroke: "type" })
        ),

        Plot.text(
          data.filter((d) => d.type == primaryNode.name),
          Plot.pointerX({
            x: "time",
            frameAnchor: "top-left",
            dx: 10,
            fontVariant: "tabular-nums",
            text: (d) => `${d.type}: ${d.value.toFixed(2)}`,
          })
        ),
        Plot.text(
          data.filter((d) => d.type == "Comparison"),
          Plot.pointerX({
            x: "time",
            frameAnchor: "top-left",
            dx: 10,
            dy: -10,
            fontVariant: "tabular-nums",
            text: (d) => `${d.type}: ${d.value.toFixed(2)}`,
          })
        ),
        Plot.text(
          data.filter((d) => d.type == "Comparison"),
          Plot.pointerX({
            x: "time",
            frameAnchor: "top-left",
            dx: 10,
            dy: -20,
            fontVariant: "tabular-nums",
            text: (d) => `${d.time.toLocaleString()}`,
          })
        ),

        Plot.line(data, {
          x: { type: "time", value: "time" },
          y: { value: "value", label: `${series} concentration (ug/m3)` },
          title: (d) => `${d.time} - ${d.value}`,
          stroke: "type",
        }),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, [primaryData, comparisonData]);

  return (
    <div>
      <div className="comparison-graph" ref={containerRef} />
      {isLoading && <Loader size="md" center />}
    </div>
  );
}

export default React.memo(ComparisonGraph);
