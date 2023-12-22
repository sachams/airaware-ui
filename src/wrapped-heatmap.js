import * as React from "react";
import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from "react";
import { getSeriesName } from "./utils";
import WrappedPanel from "./wrapped-panel";

import "./wrapped-heatmap.css";

function WrappedHeatmap({ data, series, year }) {
  const containerRef = useRef();

  const getMinMax = (data) => {
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
    return { min, max };
  };

  const range = getMinMax(data[series]);
  const formatDay = (day) => {
    const dayMapping = {
      0: "Sundays",
      1: "Mondays",
      2: "Tuesdays",
      3: "Wednesdays",
      4: "Thursdays",
      5: "Fridays",
      6: "Saturdays",
    };
    return dayMapping[day];
  };

  const formatTime = (hour) => {
    if (hour == 0) {
      return "midnight";
    } else if (hour == 12) {
      return "noon";
    } else if (hour < 12) {
      return `${hour}am`;
    } else {
      return `${hour - 12}pm`;
    }
  };

  useEffect(() => {
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
        Plot.cell(data[series], {
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
    <WrappedPanel>
      <div className="wrapped-heatmap-stats">
        <p className="wrapped-heatmap-headline">
          {formatDay(range.max.day)} at {formatTime(range.max.day)}
        </p>
        <p className="wrapped-heatmap-narrative">
          Worst {getSeriesName(series)} on average in {year}
        </p>
      </div>
      <div className="wrapped-heatmap-stats">
        <p className="wrapped-heatmap-headline">
          {formatDay(range.min.day)} at {formatTime(range.min.day)}
        </p>
        <p className="wrapped-heatmap-narrative">
          Best {getSeriesName(series)} on average in {year}
        </p>
      </div>
      <div className="wrapped-heatmap" ref={containerRef} />
    </WrappedPanel>
  );
}

export default React.memo(WrappedHeatmap);
