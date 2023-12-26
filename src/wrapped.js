import React from "react";
import { useEffect, useState } from "react";
import { Modal, Button } from "rsuite";
import "./wrapped.css";
import WrappedMap from "./wrapped-map";
import WrappedDrawer from "./wrapped-drawer";
import wrappedData from "./wrapped_2023.json";
import WelcomeImage from "./img/wrapped-welcome.png";

function Wrapped({ year }) {
  const [data, setData] = useState(undefined);
  const [selectedNode, setSelectedNode] = useState(undefined);
  const [open, setOpen] = useState(true);
  const handleClose = () => setOpen(false);

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

  const styles = {
    backgroundSize: "cover",
    padding: "30px",
    backgroundImage: `url(${WelcomeImage})`,
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
