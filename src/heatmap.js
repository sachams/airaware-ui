import axios from "axios";
import * as React from "react";
import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import "./heatmap.css";
import { Loader } from "rsuite";
import { format, set } from "date-fns";

const serverUrl = process.env.REACT_APP_SERVER_URL;

function Heatmap(props) {
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

    if (primaryNode) {
      loadData();
    }
  }, [primaryNode, series, startDate, endDate, threshold]);

  const formatDay = (d) => {
    return format(d, "ddd");
  };

  useEffect(() => {
    if (primaryData.length == 0) return;

    const plot = Plot.plot({
      style: {
        fontSize: 14,
      },
      // color: { legend: true, scheme: "Set2" },
      title: `${series.toUpperCase()} by hour and day of week`,
      marginLeft: 60,
      marginBottom: 40,
      x: {
        tickSize: 0,
        label: "Hour of day",
      },

      y: {
        tickFormat: Plot.formatWeekday("en", "short"),
        label: "Day of week",
      },

      color: {
        type: "linear",
        legend: true,
        scheme: "YlGnBu",
        reverse: true,
        zero: true,
        label: `${series.toUpperCase()} concentration (ug/m3)`,
      },

      marks: [
        Plot.cell(
          primaryData,
          Plot.group(
            { fill: "mean" },
            {
              x: (d) => d.time.getUTCHours(),
              y: (d) => d.time.getUTCDay(),
              fill: "value",
              inset: 0.5,
              tip: "x",
            }
          )
        ),
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

export default React.memo(Heatmap);
