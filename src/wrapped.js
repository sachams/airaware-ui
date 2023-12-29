import React from "react";
import { useEffect, useState } from "react";
import "./wrapped.css";
import WrappedMap from "./wrapped-map";
import WrappedDrawer from "./wrapped-drawer";
import wrappedData from "./wrapped_2023.json";

function Wrapped({ year }) {
  const [data, setData] = useState(undefined);
  const [selectedNode, setSelectedNode] = useState(undefined);

  useEffect(() => {
    // This bit below adds in some fake data
    // for (let day = 0; day < 7; day++) {
    //   for (let hour = 0; hour < 24; hour++) {
    //     wrappedData[0].heatmap.pm25.push([hour, day, Math.random() * 20]);
    //     wrappedData[0].heatmap.no2.push([hour, day, Math.random() * 20]);
    //   }
    // }
    setData(wrappedData);
  }, []);

  // const postcode = "SW2 1AW";
  // const distance = 5;

  const onSelect = (selectedNode) => {
    console.log("onSelect ", selectedNode.properties);
    const node = data.find(
      (node) => node.details.site_code === selectedNode.properties.site_code
    );
    console.log("onSelect found ", node);
    setSelectedNode(node);
  };

  const onClose = () => {
    setSelectedNode(undefined);
  };

  return (
    <>
      {data && <WrappedMap onSelect={onSelect} data={data}></WrappedMap>}
      <WrappedDrawer
        selectedNode={selectedNode}
        year={year}
        onClose={onClose}
      ></WrappedDrawer>
    </>
  );
}

export default Wrapped;
