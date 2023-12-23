import * as React from "react";
import { Grid, Row, Col } from "rsuite";
import WrappedBreach from "./wrapped-breach";
import WrappedHeatmap from "./wrapped-heatmap";
import WrappedRanking from "./wrapped-ranking";
import WrappedNode from "./wrapped-node";
import { useEffect, useState } from "react";

import "./wrapped-presentation.css";

function WrappedPresentation({ data, distance, postcode, year }) {
  useEffect(() => {
    document.body.classList.add("bg-image-wrapped");

    return () => {
      document.body.classList.remove("bg-image-wrapped");
    };
  });

  return (
    <>
      {data && (
        <Grid fluid>
          <Row>
            <Col xs={24} md={12}>
              <WrappedBreach data={data.breach} series="pm25" year={year} />
            </Col>
            <Col xs={24} md={12}>
              <WrappedBreach data={data.breach} series="no2" year={year} />
            </Col>
          </Row>

          <Row>
            <Col xs={24} md={12}>
              <WrappedHeatmap data={data.heatmap} series="pm25" year={year} />
            </Col>
            <Col xs={24} md={12}>
              <WrappedHeatmap data={data.heatmap} series="no2" year={year} />
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12}>
              <WrappedRanking data={data.rank} series="pm25" year={year} />
            </Col>
            <Col xs={24} md={12}>
              <WrappedRanking data={data.rank} series="no2" year={year} />
            </Col>
          </Row>
        </Grid>
      )}
    </>
  );
}

export default React.memo(WrappedPresentation);
