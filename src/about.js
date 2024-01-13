import React from "react";
import { Col, Row } from "antd";
import "./about.css";

function About() {
  return (
    <>
      <Row>
        <Col xs={24} sm={12}>
          <h2>What is Air Aware?</h2>

          <p>
            Air Aware is a project set up by Sacha Manson-Smith and Louise
            Thomas to look at data from the{" "}
            <a href="https://www.breathelondon.org/" target="_blank">
              Breathe London
            </a>{" "}
            network of air quality sensors. This website helps us (and others)
            analyse the data. You can read more about the project on our{" "}
            <a href="https://airaware.substack.com/" target="_blank">
              Air Aware blog
            </a>
            .
          </p>
          <h2>Feedback</h2>
          <p>
            What should we build next? What problems are you trying to
            investigate, and how can we build tools that will help? Please let
            us know on our{" "}
            <a href="https://air-aware.canny.io/" target="_blank">
              Feature Requests board
            </a>
          </p>
        </Col>
      </Row>
    </>
  );
}

export default React.memo(About);
