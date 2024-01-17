import "./compare-panel.css";

import React, { useState } from "react";

import { Col, Row } from "antd";
import { useParams } from "react-router-dom";
import { CheckTreePicker, Radio, RadioGroup, Tooltip, Whisper } from "rsuite";

import { Block, InfoOutline } from "@rsuite/icons";

import ComparisonGraph from "../comparison-graph";
import DateSelector from "../date-selector";

const selfTooltip = <Tooltip>This is already the primary node</Tooltip>;

const disabledTooltip = <Tooltip>This node is disabled</Tooltip>;

const styles = {
  radioGroup: {
    margin: "0px 0px 5px",
  },
  radio: {
    padding: "0px 5px 0px",
  },
};

function ComparePanel({ sites, dateRange, onDateChange }) {
  const params = useParams();
  const primaryNode = sites.find((node) => node.site_code === params.siteCode);

  const [frequency, setFrequency] = useState("hour");
  const [comparisonNodes, setComparisonNodes] = useState([]);

  const nodeMap = sites.reduce(
    (map, obj) => ((map[obj.site_code] = obj), map),
    {}
  );

  const formatNodeType = (site_type) => {
    const capitalised = site_type[0].toUpperCase() + site_type.slice(1);
    return capitalised.replace("_", " ");
  };

  const generateNodeTypeTreeDict = (data) => {
    let types = [];
    let nodeTree = {};
    data.forEach((node) => {
      // If we have already seen this type, add a new entry with the node
      if (types.includes(node.site_type)) {
        nodeTree[node.site_type].children.push({
          label: node.name,
          value: node.site_code,
          properties: node,
        });
      } else {
        // Else, add a new entry
        nodeTree[node.site_type] = {
          label: formatNodeType(node.site_type),
          value: node.site_type,
          children: [
            {
              label: node.name,
              value: node.site_code,
              properties: node,
            },
          ],
        };
        types.push(node.site_type);
      }
    });
    return nodeTree;
  };

  const generateNodeTypeTreeList = (nodeTree) => {
    // Now generate an array from the map of items
    const labelSort = (a, b) => {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }

      // names must be equal
      return 0;
    };

    const sortedTypes = Object.values(nodeTree).sort(labelSort);

    // Now sort the items
    sortedTypes.forEach((type) => {
      type.children = type.children.sort(labelSort);
    });
    return sortedTypes;
  };

  const nodeTypeTreeDict = generateNodeTypeTreeDict(sites);
  const nodeTypeTreeList = generateNodeTypeTreeList(nodeTypeTreeDict);

  const disabledItems = sites
    .filter((d) => {
      return !d.is_enabled;
    })
    .map((d) => {
      return d.site_code;
    });

  const onFrequencyChange = (value) => {
    setFrequency(value);
  };

  const onComparisonNodesChange = (siteCodes) => {
    const comparisonNodeArrays = siteCodes.map((d) => {
      // If the item is in the node map (ie, it is a site code)
      // then return that.
      if (d in nodeMap) {
        return nodeMap[d];
      }

      // It might also be a node type, in which case return the list of nodes
      // that make up that type
      if (d in nodeTypeTreeDict) {
        return nodeTypeTreeDict[d].children.map((node) => {
          return node.properties;
        });
      }

      console.log("ERROR: not sure what to do with ", d);
    });
    setComparisonNodes(comparisonNodeArrays.flat());
  };

  return (
    <div className="compare-panel">
      <Row style={{ paddingBottom: "5px" }}>
        <Col xs={24} md={4}>
          Date range
        </Col>
        <Col xs={24} md={12}>
          <DateSelector dateRange={dateRange} onChange={onDateChange} />
        </Col>
      </Row>
      <Row style={{ paddingBottom: "5px" }}>
        <Col xs={24} md={4}>
          Comparison
        </Col>
        <Col xs={24} md={12}>
          <CheckTreePicker
            defaultExpandAll={false}
            placeholder="Select comparison"
            size="sm"
            onChange={onComparisonNodesChange}
            uncheckableItemValues={[primaryNode?.site_code, ...disabledItems]}
            disabledItemValues={[primaryNode?.site_code, ...disabledItems]}
            data={nodeTypeTreeList}
            renderTreeNode={(nodeData) => {
              // console.log("PrimaryNode is ", primaryNode);
              if (nodeData.properties === undefined) {
                // Top level category
                return <span>{nodeData.label}</span>;
              } else if (
                nodeData.properties.site_code === primaryNode?.site_code
              ) {
                // It's the same node
                return (
                  <Whisper
                    placement="top"
                    trigger="hover"
                    speaker={selfTooltip}
                  >
                    <span>
                      <InfoOutline /> {nodeData.label}
                    </span>
                  </Whisper>
                );
              } else if (!nodeData.properties?.is_enabled) {
                // It's disabled
                return (
                  <Whisper
                    placement="top"
                    trigger="hover"
                    speaker={disabledTooltip}
                  >
                    <span>
                      <Block /> {nodeData.label}
                    </span>
                  </Whisper>
                );
              } else {
                return <span>{nodeData.label}</span>;
              }
            }}
            style={{ width: "70%" }}
          />{" "}
        </Col>
      </Row>
      <Row style={{ paddingBottom: "5px" }}>
        <Col xs={24} md={4}>
          Frequency
        </Col>
        <Col xs={24} md={12}>
          <RadioGroup
            onChange={onFrequencyChange}
            name="frequency"
            inline
            appearance="picker"
            defaultValue={frequency}
            style={styles.radioGroup}
          >
            <Radio style={styles.radio} value="hour">
              Hourly
            </Radio>
            <Radio style={styles.radio} value="day">
              Daily
            </Radio>
          </RadioGroup>
        </Col>
      </Row>
      <Row style={{ paddingBottom: "5px" }}>
        <Col xs={24} md={12}>
          <ComparisonGraph
            primaryNode={primaryNode}
            comparisonNodes={comparisonNodes}
            series="pm25"
            dateRange={dateRange}
            frequency={frequency}
          />
        </Col>
        <Col xs={24} md={12}>
          <ComparisonGraph
            primaryNode={primaryNode}
            comparisonNodes={comparisonNodes}
            series="no2"
            dateRange={dateRange}
            frequency={frequency}
          />
        </Col>
      </Row>
    </div>
  );
}

export default React.memo(ComparePanel);
