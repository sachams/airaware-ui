import React from "react";
import { Table } from "rsuite";
import "./node-panel.css";

function NodePanel({ selectedNode }) {
  return (
    <div className="node-panel">
      {selectedNode && (
        <h1 className="panel-heading">
          {selectedNode.site_code} - {selectedNode.name}
        </h1>
      )}
      {!selectedNode && (
        <h1 className="panel-heading">Select a primary node from the map</h1>
      )}

      {selectedNode && (
        <div>
          <img src={selectedNode.photo_url} />
          <p>{selectedNode.description}</p>
          <table className="node-table">
            <thead>
              <tr>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Site code</td>
                <td>{selectedNode.site_code}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>
                  {selectedNode.status === "healthy"
                    ? "operational"
                    : selectedNode.status}
                </td>
              </tr>
              <tr>
                <td>Borough</td>
                <td>{selectedNode.borough}</td>
              </tr>
              <tr>
                <td>Type</td>
                <td>{selectedNode.site_type}</td>
              </tr>
              <tr>
                <td>Installation date</td>
                <td>{new Date(selectedNode.start_date).toDateString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default React.memo(NodePanel);
