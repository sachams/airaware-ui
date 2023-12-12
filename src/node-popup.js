import * as React from "react";
import { Popup } from "react-map-gl";

function NodePopup({ longitude, latitude, properties }) {
  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      offset={[0, 0]}
      closeButton={false}
      className="hover-info"
    >
      <div className="site-info">
        <strong>{properties.name}</strong>
        <table>
          <thead>
            <tr>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Site code</td>
              <td>{properties.site_code}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>{properties.enabled_status}</td>
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
            <tr>
              <td>Type</td>
              <td>{properties.site_type}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Popup>
  );
}

export default React.memo(NodePopup);
