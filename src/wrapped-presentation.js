import "./wrapped-presentation.css";

import * as React from "react";
import { useEffect } from "react";

import { Col, Row } from "antd";

import WrappedBreach from "./wrapped-breach";
import WrappedFinal from "./wrapped-final";
import WrappedHeatmap from "./wrapped-heatmap";
import WrappedRanking from "./wrapped-ranking";

function WrappedPresentation({ data, distance, postcode, year, numNodes }) {
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
              <WrappedRanking
                data={data.rank}
                series="pm25"
                year={year}
                numNodes={numNodes}
              />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <WrappedRanking
                data={data.rank}
                series="no2"
                year={year}
                numNodes={numNodes}
              />
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
