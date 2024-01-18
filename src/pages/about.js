import "./about.css";

import React from "react";

import { Col, Row } from "antd";

function About() {
  return (
    <>
      <Row>
        <Col xs={24} sm={24} md={12}>
          <h2>What is Air Aware?</h2>

          <p>
            Air Aware is a project set up by{" "}
            <a
              href="https://www.linkedin.com/in/smansonsmith/"
              target="_blank"
              rel="noreferrer"
            >
              Sacha Manson-Smith
            </a>{" "}
            and{" "}
            <a
              href="https://www.linkedin.com/in/louise-thomas-3a687344/"
              target="_blank"
              rel="noreferrer"
            >
              Louise Thomas
            </a>{" "}
            to look at data from the{" "}
            <a
              href="https://www.breathelondon.org/"
              target="_blank"
              rel="noreferrer"
            >
              Breathe London
            </a>{" "}
            network of air quality sensors. This website helps us (and others)
            analyse the data. You can read more about the project on our{" "}
            <a
              href="https://airaware.substack.com/"
              target="_blank"
              rel="noreferrer"
            >
              Air Aware blog
            </a>
            .
          </p>
          <h2>Feedback</h2>
          <p>
            What should we build next? What problems are you trying to
            investigate, and how can we build tools that will help? Please let
            us know on our{" "}
            <a
              href="https://air-aware.canny.io/"
              target="_blank"
              rel="noreferrer"
            >
              Feature Requests board
            </a>
          </p>
        </Col>
      </Row>
    </>
  );
}

export default React.memo(About);
