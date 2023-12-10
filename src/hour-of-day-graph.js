import axios from "axios";
import * as React from "react";
import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import "./breach-calendar.css";
import { Loader } from "rsuite";
import { format, set } from "date-fns";
import { primaryNodeColour } from "./mapStyle";

const serverUrl = process.env.REACT_APP_SERVER_URL;

function HourOfDayGraph(props) {
  const { primaryNode, series, dateRange, threshold } = props;

  const containerRef = useRef();
  const [primaryData, setPrimaryData] = useState([]);
  const [startDate, endDate] = dateRange;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching primary calendar series data from server");
        setIsLoading(true);

        // Load all the data asynchronously and wait for the result
        const [primaryData] = await Promise.all([
          axios.get(
            `${serverUrl}/sensor/${series}/${startDate.toISOString()}/${endDate.toISOString()}/hour?codes=${
              primaryNode.site_code
            }`
          ),
        ]);

        const data = primaryData.data.map((d) => ({
          time: new Date(d.time),
          value: d.value,
        }));

        setIsLoading(false);
        setPrimaryData(data);
      } catch (error) {
        console.error("Error fetching primary calendar series data:", error);
      }
    };

    loadData();
  }, [primaryNode, series, startDate, endDate, threshold]);

  useEffect(() => {
    if (primaryData.length == 0) return;

    const plot = Plot.plot({
      style: {
        fontSize: 14,
      },
      title: `${series.toUpperCase()} by hour of day`,
      subtitle: `Red line - WHO 24h limit. Black line - average reading`,
      marginLeft: 60,
      marginBottom: 40,
      x: {
        label: "Hour of day",
        tickSize: 2,
      },
      y: {
        label: `${series} concentration (ug/m3)`,
        labelAnchor: "center",
      },

      // color: {
      //   fill: "#2d60a7",
      // },

      marks: [
        Plot.barY(
          primaryData,
          Plot.groupX(
            { y: "mean" },

            {
              x: (d) => d.time.getUTCHours(),
              y: (d) => d.value,
              fill: primaryNodeColour,
              tip: "x",
            }
          )
        ),
        // Add aerage line
        Plot.ruleY(
          primaryData,
          Plot.groupZ(
            { y: "mean" },
            {
              y: (d) => d.value,
              stroke: "black",
              strokeWidth: 2,
              strokeDasharray: "4",
            }
          )
        ),
        // Add threshold
        Plot.ruleY([threshold], {
          stroke: "red",
          strokeWidth: 2,
          strokeDasharray: "4",
        }),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, [primaryData]);

  return (
    <div>
      <div className="breach-calendar" ref={containerRef} />
      {isLoading && <Loader size="md" center />}
    </div>
  );
}

export default React.memo(HourOfDayGraph);
