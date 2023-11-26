import * as React from "react";
import { Popup } from "react-map-gl";

function NodePopup({ longitude, latitude, properties }) {
  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      offset={[0, -10]}
      closeButton={false}
      className="hover-info"
    >
      <strong>{properties.name}</strong>
      <p>
        {properties.description === "null"
          ? "No description"
          : properties.description}
      </p>
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
            <td>{properties.status}</td>
          </tr>
          <tr>
            <td>Average PM2.5</td>
            <td>{properties.AveragePM25?.toFixed?.(2) ?? "--"} μg/m³</td>
          </tr>
          <tr>
            <td>Average NO2</td>
            <td>{properties.AverageNO2?.toFixed?.(2) ?? "--"} μg/m³</td>
          </tr>
          <tr>
            <td>Borough</td>
            <td>{properties.borough}</td>
          </tr>
        </tbody>
      </table>
    </Popup>
  );
}

export default React.memo(NodePopup);
