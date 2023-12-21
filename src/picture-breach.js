import axios from "axios";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import "./picture-breach.css";
import { getSeriesName } from "./utils";
import * as d3 from "d3";
import { layout } from "d3-iconarray";
import { appendStockingIcon, appendTreeIcon } from "./svg-utils";

const serverUrl = process.env.REACT_APP_SERVER_URL;

function PictureBreach(props) {
  const { siteCode, series, dateRange, threshold } = props;

  const containerRef = useRef();
  const [data, setData] = useState(undefined);
  const [colourArray, setColourArray] = useState(undefined);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching primary calendar series data from server");

        // // Load all the data asynchronously and wait for the result
        // const [primaryData] = await Promise.all([
        //   axios.get(
        //     `${serverUrl}/sensor/${series}/${startDate.toISOString()}/${endDate.toISOString()}/day?codes=${siteCode}`
        //   ),
        // ]);

        // const data = primaryData.data.map((d) => ({
        //   time: new Date(d.time),
        //   value: d.value,
        // }));

        const data = {
          ok: 20,
          breach: 315,
          no_data: 30,
        };

        const colourMapping = {
          ok: "green",
          breach: "red",
          no_data: "lightgrey",
        };
        const colourArray = [
          ...Array(data.ok).fill(colourMapping.ok),
          ...Array(data.breach).fill(colourMapping.breach),
          ...Array(data.no_data).fill(colourMapping.no_data),
        ];

        setData(data);
        setColourArray(colourArray);
      } catch (error) {
        console.error("Error fetching primary calendar series data:", error);
      }
    };

    loadData();
  }, [siteCode, series, startDate, endDate, threshold]);

  useEffect(() => {
    if (colourArray == undefined) return;

    const svgElement = d3.select(containerRef.current);
    const margin = { top: 0, left: 20, bottom: 0, right: 20 }; //note that objects need to be wrapped in () so they're evaluated
    const gridWidth = 18;
    const width = 400;
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
  }, [colourArray]);

  return (
    <div id="wrapper">
      {data && (
        <div id="text-wrapper">
          <p id="count">{data.breach}</p>
          <p id="narrative">
            Breaches of WHO guidelines for {getSeriesName(series)} in{" "}
            {startDate.getFullYear()}.
          </p>
        </div>
      )}
      <svg id="chart" ref={containerRef} />
      {data && (
        <div id="text-wrapper">
          <p id="subtitle">Grey icons are days with no data</p>
        </div>
      )}
    </div>
  );
}

export default PictureBreach;
