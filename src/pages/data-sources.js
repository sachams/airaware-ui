import React from "react";

import { Col, Descriptions, Row } from "antd";

function DataSources() {
  const description = [
    {
      label: "Air quality node data",
      children: (
        <a
          href="https://www.breathelondon.org/developers"
          target="_blank"
          rel="noreferrer"
        >
          Breathe London API
        </a>
      ),
    },
    {
      label: "LTN datasets",
      children: (
        <a
          href="https://blog.westminster.ac.uk/ata/projects/london-ltn-dataset/"
          target="_blank"
          rel="noreferrer"
        >
          University of Westminster
        </a>
      ),
    },
  ];

  return (
    <>
      <h2>Data sources</h2>
      <p>The data comes from the following sources:</p>
      <Row>
        <Col xs={24} sm={12}>
          <Descriptions
            column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
            bordered
            items={description}
          />
        </Col>
      </Row>
    </>
  );
}

export default React.memo(DataSources);
