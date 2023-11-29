import * as React from "react";

function SidePanel({ nodeProperties }) {
  return (
    <div className="side-panel">
      <strong>{nodeProperties.name}</strong>
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Status</td>
            <td>
              {nodeProperties.status == "healthy"
                ? "operational"
                : nodeProperties.status}
            </td>
          </tr>
          <tr>
            <td>Average PM2.5</td>
            <td>{nodeProperties.AveragePM25?.toFixed?.(2) ?? "--"} μg/m³</td>
          </tr>
          <tr>
            <td>Average NO2</td>
            <td>{nodeProperties.AverageNO2?.toFixed?.(2) ?? "--"} μg/m³</td>
          </tr>
          <tr>
            <td>Borough</td>
            <td>{nodeProperties.borough}</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>{nodeProperties.site_type}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default React.memo(SidePanel);
