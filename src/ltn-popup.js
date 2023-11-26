import * as React from "react";
import { Popup } from "react-map-gl";

function LtnPopup({ longitude, latitude, properties }) {
  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      offset={[0, -10]}
      closeButton={false}
      className="hover-info"
    >
      <strong>{properties.Name}</strong>
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Date added</td>
            <td>{properties.Date}</td>
          </tr>
          <tr>
            <td>Date removed</td>
            <td>
              {properties.Date_Remov === "null" ? properties.Date_Remov : "N/A"}
            </td>
          </tr>
          <tr>
            <td>Comments</td>
            <td>
              {properties.Comments === "null" ? "None" : properties.Comments}
            </td>
          </tr>
          <tr>
            <td>Borough</td>
            <td>{properties.LGA}</td>
          </tr>
        </tbody>
      </table>
    </Popup>
  );
}

export default React.memo(LtnPopup);
