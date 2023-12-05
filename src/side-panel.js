import React, { useState } from "react";
import ComparisonGraph from "./comparison-graph";
import DateSelector from "./date-selector";

import subDays from "date-fns/subDays";
import subYears from "date-fns/subYears";
import set from "date-fns/set";

import "./side-panel.css";

const defaultEndDate = set(new Date(), {
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
});

function SidePanel({ nodeProperties }) {
  const [dateRange, setDateRange] = useState([
    subDays(defaultEndDate, 30),
    defaultEndDate,
  ]);

  const [frequency, setFrequency] = useState("hour");
  const [state, setState] = useState("collapsed");

  const onDateChange = (dateRange) => {
    setDateRange(dateRange);
  };

  return (
    <div className={"side-panel-" + state}>
      <h1 className="side-panel-title">
        {nodeProperties.site_code} - {nodeProperties.name}
      </h1>

      <DateSelector dateRange={dateRange} onChange={onDateChange} />
      <div>
        <div className={"comparison-graph-" + state}>
          <ComparisonGraph
            primary={nodeProperties}
            comparison={nodeProperties}
            series="pm25"
            dateRange={dateRange}
            frequency={frequency}
          />
        </div>
        <div className={"comparison-graph-" + state}>
          <ComparisonGraph
            primary={nodeProperties}
            comparison={nodeProperties}
            series="no2"
            dateRange={dateRange}
            frequency={frequency}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(SidePanel);
