import * as React from "react";
import { useEffect, useRef } from "react";
import "./wrapped-breach.css";
import { getSeriesName } from "./utils";
import * as d3 from "d3";
import { layout } from "d3-iconarray";
import { appendStockingIcon, appendTreeIcon } from "./svg-utils";
import Units from "./units";
import { thresholds } from "./utils";
import WrappedPanel from "./wrapped-panel";

function WrappedBreach({ data, series, year }) {
  const containerRef = useRef();

  const colourMapping = {
    ok: "green",
    breach: "red",
    no_data: "lightgrey",
  };

  const colourArray = [
    ...Array(data[series].ok).fill(colourMapping.ok),
    ...Array(data[series].breach).fill(colourMapping.breach),
    ...Array(data[series].no_data).fill(colourMapping.no_data),
  ];

  useEffect(() => {
    const svgElement = d3.select(containerRef.current);
    const margin = { top: 0, left: 20, bottom: 0, right: 20 }; //note that objects need to be wrapped in () so they're evaluated
    const gridWidth = 18;
    const width = 315;
    const height = 800;
    const arrayScale = d3
      .scaleLinear()
      .domain([0, 20])
      .range([0, width - (margin.left + margin.right)]);
    const layoutFunc = layout().width(gridWidth);

    appendStockingIcon(svgElement, "stockingIcon");
    appendTreeIcon(svgElement, "treeIcon");

    svgElement
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .selectAll()
      .data(layoutFunc(colourArray))
      .enter()
      .append("use")
      .attr("xlink:href", series === "pm25" ? "#stockingIcon" : "#treeIcon")
      .attr("x", (d) => arrayScale(d.position.x))
      .attr("y", (d) => arrayScale(d.position.y))
      .attr("fill", (d) => d.data);
  }, []);

  return (
    <WrappedPanel>
      <div className="wrapped-panel-header">
        <p className="wrapped-panel-number">{data[series].breach}</p>
        <p className="wrapped-panel-title">
          Breaches of WHO guidelines for {getSeriesName(series)} in {year}.
        </p>
      </div>
      <svg id="chart" ref={containerRef} />
      <p className="wrapped-panel-footer">
        The WHO daily guideline limit is {thresholds[series]["who"].value}
        <Units />. Grey icons are days with no data.
      </p>
    </WrappedPanel>
  );
}

export default WrappedBreach;
