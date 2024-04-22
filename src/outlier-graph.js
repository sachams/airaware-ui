import "./outlier-graph.css";

import * as React from "react";
import { useEffect, useRef } from "react";

import { format } from "date-fns";
import { html } from "htl";

import * as Plot from "@observablehq/plot";

import PathConstants from "./routes/pathConstants";
import { getSeriesName } from "./utils";

function OutlierGraph({ data, series, siteCode, threshold }) {
  const containerRef = useRef();

  useEffect(() => {
    if (!data || !containerRef.current) {
      return;
    }

    if (data.length === 0) return;

    const enrichedOutlierData = [];
    Object.keys(data.outlier_data).forEach((type) => {
      data.outlier_data[type].forEach((point) => {
        enrichedOutlierData.push({
          time: new Date(point.time),
          value: point.value,
          type: type,
        });
      });
    });

    const contextData = data.context_data.map((d) => ({
      time: new Date(d.time),
      value: d.value,
    }));

    const plot = Plot.plot({
      marginLeft: 60,
      title: html`<a href="${PathConstants.NODE_COMPARE.replace(
        ":siteCode",
        siteCode
      )}?startDate=${data.range.start}&endDate=${
        data.range.end
      }" target="_blank"/>Explore this graph</a>`,
      marginBottom: 40,
      y: {
        label: `${getSeriesName(series)} concentration (ug/m3)`,
        labelAnchor: "center",
      },
      style: {
        fontSize: 16,
      },
      marks: [
        // Outliers
        Plot.dot(enrichedOutlierData, {
          x: { type: "time", value: "time" },
          y: {
            value: "value",
            label: `${getSeriesName(series)} concentration (ug/m3)`,
          },
          title: (d) => `${d.time} - ${d.value}`,
          stroke: "type",
          tip: false,
        }),

        // Context
        Plot.line(contextData, {
          x: { type: "time", value: "time" },
          y: {
            value: "value",
            label: `${getSeriesName(series)} concentration (ug/m3)`,
          },
          title: (d) => `${d.time} - ${d.value}`,
          stroke: "black",
          strokeWidth: 1,
          tip: false,
        }),
        // Add threshold
        Plot.ruleY([threshold], {
          stroke: "red",
          strokeWidth: 2,
          strokeDasharray: "4",
        }),
        // tooltip on context data
        Plot.tip(
          contextData,
          Plot.pointer({
            x: { type: "time", value: "time" },
            y: {
              value: "value",
            },
            title: (d) =>
              `${format(d.time, "dd MMM yy hh:mm:ss")} - ${d.value.toFixed(
                2
              )} ug/m3`,
          })
        ),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, [data]);

  return <div className="outlier-graph" ref={containerRef} />;
}

export default React.memo(OutlierGraph);
