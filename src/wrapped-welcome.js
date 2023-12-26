import * as React from "react";
import {
  FlexboxGrid,
  Panel,
  Form,
  ButtonToolbar,
  Button,
  Modal,
  Schema,
} from "rsuite";
import { useEffect, useState } from "react";
import "./wrapped-welcome.css";

function WrappedWelcome({ onClose }) {
  useEffect(() => {
    document.body.classList.add("bg-image-welcome");

    return () => {
      document.body.classList.remove("bg-image-welcome");
    };
  });

  return (
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
          Tackling it will make us happier and healthier. What a Christmas gift
          to give.
        </p>
        <p>
          Pass on to all your London friends! The more people who know about air
          pollution, the more equipped we are to address it!
        </p>
        <p>
          Search for a monitoring station near you then click on it to see your
          report.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} appearance="primary">
          Let's go!
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default React.memo(WrappedWelcome);
