import React, { useState } from "react";
import { DateTime } from "luxon";
import ComparisonGraph from "./comparison-graph";

function SidePanel({ nodeProperties }) {
  const [startDate, setStartDate] = useState(
    DateTime.now().minus({ months: 1 })
  );
  const [endDate, setEndDate] = useState(DateTime.now());
  const [frequency, setFrequency] = useState("hour");
  const [state, setState] = useState("collapsed");

  return (
    <div className={"side-panel-" + state}>
      <h1 className="side-panel-title">
        {nodeProperties.site_code} - {nodeProperties.name}
      </h1>
      <h2 className="side-panel-subtitle">
        {startDate.toLocaleString()} - {endDate.toLocaleString()}
      </h2>
      <div>
        <div className={"comparison-graph-" + state}>
          <ComparisonGraph
            primary={nodeProperties}
            comparison={nodeProperties}
            series="pm25"
            startDate={startDate}
            endDate={endDate}
            frequency={frequency}
          />
        </div>
        <div className={"comparison-graph-" + state}>
          <ComparisonGraph
            primary={nodeProperties}
            comparison={nodeProperties}
            series="no2"
            startDate={startDate}
            endDate={endDate}
            frequency={frequency}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(SidePanel);
