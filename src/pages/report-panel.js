import "./report-panel.css";

import React from "react";

import set from "date-fns/set";
import subMonths from "date-fns/subMonths";
import { useParams } from "react-router-dom";
import { useQueryState } from "react-router-use-location-state";
import { Col, Grid, Row } from "rsuite";

import BreachByMonth from "../breach-by-month";
import BreachCalendar from "../breach-calendar";
import DateSelector from "../date-selector";
import Heatmap from "../heatmap";
import HourOfDayGraph from "../hour-of-day-graph";

function ReportPanel({ sites }) {
  const params = useParams();
  const primaryNode = sites?.find((node) => node.site_code === params.siteCode);
  const defaultEndDate = set(new Date(), {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  const [startDate, setStartDate] = useQueryState(
    "startDate",
    subMonths(defaultEndDate, 1)
  );
  const [endDate, setEndDate] = useQueryState("endDate", defaultEndDate);

  const onDateChange = (dateRange) => {
    setStartDate(dateRange[0]);
    setEndDate(dateRange[1]);
  };

  return (
    <div className="report-panel">
      <Grid fluid>
        <Row className="report-row">
          <Col xs={24} md={4}>
            Date range
          </Col>
          <Col xs={24} md={12}>
            <DateSelector
              dateRange={[startDate, endDate]}
              onChange={onDateChange}
            />
          </Col>
        </Row>
        <Row className="report-row">
          <Col xs={24} md={12}>
            {" "}
            <BreachCalendar
              primaryNode={primaryNode}
              series="pm25"
              dateRange={[startDate, endDate]}
              threshold={15}
            />
          </Col>
          <Col xs={24} md={12}>
            <BreachCalendar
              primaryNode={primaryNode}
              series="no2"
              dateRange={[startDate, endDate]}
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
              dateRange={[startDate, endDate]}
              threshold={15}
            />
          </Col>
          <Col xs={24} md={12}>
            <BreachByMonth
              primaryNode={primaryNode}
              series="no2"
              dateRange={[startDate, endDate]}
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
              dateRange={[startDate, endDate]}
              threshold={15}
            />
          </Col>
          <Col xs={24} md={12}>
            <HourOfDayGraph
              primaryNode={primaryNode}
              series="no2"
              dateRange={[startDate, endDate]}
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
              dateRange={[startDate, endDate]}
              threshold={15}
            />
          </Col>
          <Col xs={24} md={12}>
            <Heatmap
              primaryNode={primaryNode}
              series="no2"
              dateRange={[startDate, endDate]}
              threshold={25}
            />
          </Col>
        </Row>
      </Grid>
    </div>
  );
}

export default React.memo(ReportPanel);
