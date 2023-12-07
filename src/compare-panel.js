import React, { useState } from "react";
import ComparisonGraph from "./comparison-graph";
import DateSelector from "./date-selector";

import subDays from "date-fns/subDays";
import set from "date-fns/set";
import {
  Radio,
  RadioGroup,
  FlexboxGrid,
  CheckTreePicker,
  Divider,
} from "rsuite";
import "./compare-panel.css";
import "./side-panel.css";

const styles = {
  radioGroup: {
    margin: "0px 0px 5px",
  },
  radio: {
    padding: "0px 5px 0px",
  },
};

const defaultEndDate = set(new Date(), {
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
});

function ComparePanel({ siteData, selectedNode }) {
  const [dateRange, setDateRange] = useState([
    subDays(defaultEndDate, 30),
    defaultEndDate,
  ]);

  const [frequency, setFrequency] = useState("hour");
  const primaryNode = selectedNode;
  const [comparisonNodes, setComparisonNodes] = useState([]);

  const nodeMap = siteData?.features.reduce(
    (map, obj) => ((map[obj.properties.site_code] = obj.properties), map),
    {}
  );

  const formatNodeType = (site_type) => {
    const capitalised = site_type[0].toUpperCase() + site_type.slice(1);
    return capitalised.replace("_", " ");
  };

  const generateNodeTypeTreeDict = (data) => {
    let types = [];
    let nodeTree = {};
    data.features.forEach((node) => {
      // If we have already seen this type, add a new entry with the node
      if (types.includes(node.properties.site_type)) {
        nodeTree[node.properties.site_type].children.push({
          label: node.properties.name,
          value: node.properties.site_code,
          properties: node.properties,
        });
      } else {
        // Else, add a new entry
        nodeTree[node.properties.site_type] = {
          label: formatNodeType(node.properties.site_type),
          value: node.properties.site_type,
          children: [
            {
              label: node.properties.name,
              value: node.properties.site_code,
              properties: node.properties,
            },
          ],
        };
        types.push(node.properties.site_type);
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

  const nodeTypeTreeDict = generateNodeTypeTreeDict(siteData);
  const nodeTypeTreeList = generateNodeTypeTreeList(nodeTypeTreeDict);

  const nodeList = siteData?.features.map((item) => ({
    label: item.properties.name,
    value: item.properties.site_code,
  }));

  const onDateChange = (dateRange) => {
    setDateRange(dateRange);
  };

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
      <FlexboxGrid align="middle">
        <FlexboxGrid.Item colspan={3}>Comparison</FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={12}>
          <CheckTreePicker
            defaultExpandAll={false}
            placeholder="Select comparison"
            size="sm"
            onChange={onComparisonNodesChange}
            uncheckableItemValues={[primaryNode?.site_code]}
            disabledItemValues={[primaryNode?.site_code]}
            data={nodeTypeTreeList}
            style={{ width: "70%" }}
          />
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <FlexboxGrid align="middle">
        <FlexboxGrid.Item colspan={3}>Date</FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={12}>
          <DateSelector dateRange={dateRange} onChange={onDateChange} />
        </FlexboxGrid.Item>
      </FlexboxGrid>

      <FlexboxGrid align="middle">
        <FlexboxGrid.Item colspan={3}>Frequency</FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={12}>
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
        </FlexboxGrid.Item>
      </FlexboxGrid>

      <Divider />
      <FlexboxGrid>
        <FlexboxGrid.Item colspan={12}>
          {" "}
          <ComparisonGraph
            primaryNode={primaryNode}
            comparisonNodes={comparisonNodes}
            series="pm25"
            dateRange={dateRange}
            frequency={frequency}
          />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={12}>
          <ComparisonGraph
            primaryNode={primaryNode}
            comparisonNodes={comparisonNodes}
            series="no2"
            dateRange={dateRange}
            frequency={frequency}
          />
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </div>
  );
}

export default React.memo(ComparePanel);
