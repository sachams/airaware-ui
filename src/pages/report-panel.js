import React from "react";
import DateSelector from "../date-selector";

import "./report-panel.css";
import BreachCalendar from "../breach-calendar";
import BreachByMonth from "../breach-by-month";
import HourOfDayGraph from "../hour-of-day-graph";
import Heatmap from "../heatmap";
import { Grid, Row, Col } from "rsuite";
import { useParams } from "react-router-dom";

function ReportPanel({ sites, dateRange, onDateChange }) {
  const params = useParams();
  const primaryNode = sites?.find((node) => node.site_code === params.siteCode);

  return (
    <div className="report-panel">
      <Grid fluid>
        <Row className="report-row">
          <Col xs={24} md={4}>
            Date range
          </Col>
          <Col xs={24} md={12}>
            <DateSelector dateRange={dateRange} onChange={onDateChange} />
          </Col>
        </Row>
        <Row className="report-row">
          <Col xs={24} md={12}>
            {" "}
            <BreachCalendar
              primaryNode={primaryNode}
              series="pm25"
              dateRange={dateRange}
              threshold={15}
            />
          </Col>
          <Col xs={24} md={12}>
            <BreachCalendar
              primaryNode={primaryNode}
              series="no2"
              dateRange={dateRange}
              threshold={25}
            />
          </Col>
        </Row>
        <Row className="report-row">
          <Col xs={24} md={12}>
            {" "}
            <BreachByMonth
              primaryNode={primaryNode}
              series="pm25"
              dateRange={dateRange}
              threshold={15}
            />
          </Col>
          <Col xs={24} md={12}>
            <BreachByMonth
              primaryNode={primaryNode}
              series="no2"
              dateRange={dateRange}
              threshold={25}
            />
          </Col>
        </Row>
        <Row className="report-row">
          <Col xs={24} md={12}>
            {" "}
            <HourOfDayGraph
              primaryNode={primaryNode}
              series="pm25"
              dateRange={dateRange}
              threshold={15}
            />
          </Col>
          <Col xs={24} md={12}>
            <HourOfDayGraph
              primaryNode={primaryNode}
              series="no2"
              dateRange={dateRange}
              threshold={25}
            />
          </Col>
        </Row>
        <Row className="report-row">
          <Col xs={24} md={12}>
            {" "}
            <Heatmap
              primaryNode={primaryNode}
              series="pm25"
              dateRange={dateRange}
              threshold={15}
            />
          </Col>
          <Col xs={24} md={12}>
            <Heatmap
              primaryNode={primaryNode}
              series="no2"
              dateRange={dateRange}
              threshold={25}
            />
          </Col>
        </Row>
      </Grid>
    </div>
  );
}

export default React.memo(ReportPanel);
