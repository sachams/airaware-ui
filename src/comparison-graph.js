import axios from "axios";
import * as React from "react";
import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";

const serverUrl = process.env.REACT_APP_SERVER_URL;

function ComparisonGraph(props) {
  const { primary, comparison, series, startDate, endDate, frequency } = props;

  const containerRef = useRef();
  const [data, setData] = useState();

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching series data from server");

        // Load all the data asynchronously and wait for the result
        const [primaryData, comparisonData] = await Promise.all([
          axios.get(
            `${serverUrl}/sensor/${series}/${startDate.toString()}/${endDate.toString()}/${frequency}?codes=${
              primary.site_code
            }`
          ),
          axios.get(
            `${serverUrl}/sensor/${series}/${startDate.toString()}/${endDate.toString()}/${frequency}?codes=CLDP0001`
          ),
        ]);

        const primaryDataRemapped = primaryData.data.map((d) => ({
          time: new Date(d.time),
          value: d.value,
          type: "Node",
        }));
        const comparisonDataRemapped = comparisonData.data.map((d) => ({
          time: new Date(d.time),
          value: d.value,
          type: "Comparison",
        }));
        const data = primaryDataRemapped.concat(comparisonDataRemapped);
        // const data = primaryDataRemapped;

        setData(data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    loadData();
  }, [primary, comparison, series, startDate, endDate, frequency]);

  useEffect(() => {
    console.log("Plot - data is ", data);
    if (data === undefined) return;
    const plot = Plot.plot({
      color: { legend: true, scheme: "Set2" },
      title: series.toUpperCase(),
      marks: [
        Plot.ruleY([0]),
        Plot.ruleX(data, Plot.pointerX({ x: "time", stroke: "red" })),

        Plot.dot(
          data.filter((d) => d.type == "Node"),
          Plot.pointerX({ x: "time", y: "value", stroke: "type" })
        ),
        Plot.dot(
          data.filter((d) => d.type == "Comparison"),
          Plot.pointerX({ x: "time", y: "value", stroke: "type" })
        ),

        Plot.text(
          data.filter((d) => d.type == "Node"),
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
  }, [data]);

  return <div ref={containerRef} />;
}

export default React.memo(ComparisonGraph);
