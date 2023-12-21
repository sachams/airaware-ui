import axios from "axios";
import * as React from "react";
import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import "./wrapped-heatmap.css";
import { Loader } from "rsuite";
import { format, set } from "date-fns";
import { getSeriesName } from "./utils";

const serverUrl = process.env.REACT_APP_SERVER_URL;

function WrappedHeatmap({ year, series }) {
  const containerRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    let data = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        data.push({ day, hour, value: Math.random() * 20 });
      }
    }
    setData(data);
  }, []);

  const getMaxMin = (data) => {
    let max = undefined;
    let min = undefined;

    data.forEach((d) => {
      if (max == undefined || d.value > max.value) {
        max = d;
      }

      if (min == undefined || d.value < min.value) {
        min = d;
      }
    });
    return [max, min];
  };
  const formatDay = (d) => {
    return format(d, "ddd");
  };

  useEffect(() => {
    if (data.length == 0) return;

    const plot = Plot.plot({
      className: "chart",
      style: {
        fontSize: 14,
        backgroundColor: "#00000000",
      },
      marginLeft: 60,
      marginBottom: 40,
      x: {
        tickSize: 0,
        label: "Hour of day",
      },

      y: {
        tickFormat: Plot.formatWeekday("en", "short"),
      },

      color: {
        type: "linear",
        className: "legend",
        legend: true,
        scheme: "YlGnBu",
        reverse: true,
        zero: true,
        label: `${getSeriesName(series)} concentration (ug/m3)`,
      },

      marks: [
        Plot.cell(data, {
          x: (d) => d.hour,
          y: (d) => d.day,
          fill: "value",
          inset: 0.5,
        }),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, [data]);

  return (
    <div id="wrapper">
      {data && (
        <div id="text-wrapper">
          <p id="narrative">
            On average in {year}, {getSeriesName(series)} was worst on Tuesdays
            at 1pma nd the worst was Monday 4am.
          </p>
        </div>
      )}
      <div className="wrapped-heatmap" ref={containerRef} />
    </div>
  );
}

export default React.memo(WrappedHeatmap);
