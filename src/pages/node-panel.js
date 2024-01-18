import "./node-panel.css";

import React from "react";

import { Col, Descriptions, Row } from "antd";
import { useParams } from "react-router-dom";

function NodePanel({ sites }) {
  const params = useParams();
  const selectedNode = sites?.find(
    (node) => node.site_code === params.siteCode
  );

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
        <Col xs={24} sm={12}>
          <Descriptions
            column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2, xxl: 2 }}
            bordered
            items={description}
          />
        </Col>
      </Row>
    </>
  );
}

export default React.memo(NodePanel);
