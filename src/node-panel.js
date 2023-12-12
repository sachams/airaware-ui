import React from "react";
import { Table } from "rsuite";
import "./node-panel.css";
import { Grid, Row, Col } from "rsuite";

function NodePanel({ selectedNode }) {
  return (
    <div className="node-panel">
      {selectedNode && (
        <Grid fluid>
          <Row>
            <Col xs={8}>
              {" "}
              <img src={selectedNode.photo_url} />
            </Col>
            <Col xs={16}>
              <p>{selectedNode.description}</p>
            </Col>
          </Row>
          <Row className="report-row">
            <Col xs={24}>
              <table className="node-table">
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Site code</td>
                    <td>{selectedNode.site_code}</td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>{selectedNode.enabled_status}</td>
                  </tr>
                  <tr>
                    <td>Borough</td>
                    <td>{selectedNode.borough}</td>
                  </tr>
                  <tr>
                    <td>Type</td>
                    <td>{selectedNode.site_type}</td>
                  </tr>
                  <tr>
                    <td>Installation date</td>
                    <td>{new Date(selectedNode.start_date).toDateString()}</td>
                  </tr>
                </tbody>
              </table>{" "}
            </Col>
          </Row>
        </Grid>
      )}
    </div>
  );
}

export default React.memo(NodePanel);
