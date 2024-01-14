import * as React from "react";
import { Col, Row } from "antd";
import WrappedBreach from "./wrapped-breach";
import WrappedHeatmap from "./wrapped-heatmap";
import WrappedRanking from "./wrapped-ranking";
import WrappedFinal from "./wrapped-final";
import { useEffect } from "react";

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
        <>
          <Row>
            <Col xs={24} md={12} xl={6}>
              <WrappedBreach data={data.breach} series="pm25" year={year} />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <WrappedBreach data={data.breach} series="no2" year={year} />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <WrappedHeatmap data={data.heatmap} series="pm25" year={year} />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <WrappedHeatmap data={data.heatmap} series="no2" year={year} />
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12} xl={6}>
              <WrappedRanking data={data.rank} series="pm25" year={year} />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <WrappedRanking data={data.rank} series="no2" year={year} />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <WrappedFinal />
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default React.memo(WrappedPresentation);
