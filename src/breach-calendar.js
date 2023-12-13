import axios from "axios";
import * as React from "react";
import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import "./breach-calendar.css";
import { Loader } from "rsuite";
import { format, set } from "date-fns";
import { getSeriesName } from "./utils";

const serverUrl = process.env.REACT_APP_SERVER_URL;

function BreachCalendar(props) {
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
            `${serverUrl}/sensor/${series}/${startDate.toISOString()}/${endDate.toISOString()}/day?codes=${
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

  const formatMonthYear = (d) => {
    console.log("dt is ", d);
    return format(d, "MMM yy");
  };

  useEffect(() => {
    if (primaryData.length == 0) return;

    const plot = Plot.plot({
      style: {
        fontSize: 14,
      },
      // color: { legend: true, scheme: "Set2" },
      title: `${getSeriesName(series)} daily WHO breaches`,
      subtitle: `Red - WHO 24h limit of ${threshold.toFixed()} ug/m3 breached`,
      marginLeft: 60,
      marginBottom: 40,
      x: {
        tickSize: 0,
      },

      y: {
        tickFormat: formatMonthYear,
        tickSize: 0,
        type: "point",
      },

      color: {
        type: "threshold",
        domain: [threshold],
        range: ["green", "red"],
      },

      marks: [
        Plot.dot(primaryData, {
          x: (d) => d.time.getUTCDate(),
          y: (d) =>
            set(d.time, {
              date: 1,
              hours: 0,
              minutes: 0,
              seconds: 0,
              milliseconds: 0,
            }),
          fill: "value",
          inset: 0.5,
          r: 7,
        }),
        Plot.tip(
          primaryData,
          Plot.pointer({
            x: (d) => d.time.getUTCDate(),
            y: (d) =>
              set(d.time, {
                date: 1,
                hours: 0,
                minutes: 0,
                seconds: 0,
                milliseconds: 0,
              }),
            title: (d) =>
              `${format(d.time, "dd MMM yy")} - ${d.value.toFixed(2)} ug/m3`,
          })
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

export default React.memo(BreachCalendar);
