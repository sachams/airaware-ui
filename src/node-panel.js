import React from "react";
import { Descriptions } from "antd";
import "./node-panel.css";
import { Col, Row } from "antd";

function NodePanel({ selectedNode }) {
  const description = [
    { label: "Name", children: selectedNode?.name },
    { label: "Site code", children: selectedNode?.site_code },
    { label: "Status", children: selectedNode?.enabled_status },
    { label: "Borough", children: selectedNode?.borough },
    { label: "Type", children: selectedNode?.site_type },
    {
      label: "Installation date",
      children: new Date(selectedNode?.start_date).toDateString(),
    },
    { label: "Description", children: selectedNode?.description },
  ];

  return (
    <>
      <Row>
        <Col xs={24} sm={12}>
          {" "}
          <img src={selectedNode?.photo_url} />
        </Col>
        <Col xs={12} sm={12}>
          <Descriptions
            column={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }}
            bordered
            items={description}
          />
        </Col>
      </Row>
    </>
  );
}

export default React.memo(NodePanel);
