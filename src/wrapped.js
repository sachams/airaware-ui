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
      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Air Aware Wrapped</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            A little gift from Air Aware this Christmas! Unwrap your treasure
            trove of air quality information for where you live.
          </p>
          <p>
            Air pollution is the biggest environmental threat to our health.
            Tackling it will make us happier and healthier. What a Christmas
            gift to give.
          </p>
          <p>
            Pass on to all your London friends! The more people who know about
            air pollution, the more equipped we are to address it!
          </p>
          <p>
            Search for a monitoring station near you then click on it to see
            your report.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            Let's go!
          </Button>
        </Modal.Footer>
      </Modal>
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
