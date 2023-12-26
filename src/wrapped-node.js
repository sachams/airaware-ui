import * as React from "react";
import "./wrapped-node.css";
import WrappedPanel from "./wrapped-panel";

function WrappedNode({ data, distance, postcode, year }) {
  return (
    <WrappedPanel>
      <p id="narrative">
        Your nearest node is {data?.name} which is about {distance} miles away.
        The data coming from this node - the further away you are, the less
        relevant it is.
      </p>
      {distance > 10 && (
        <p id="narrative">
          Note that this node is really quite far away from {postcode}!
        </p>
      )}
    </WrappedPanel>
  );
}

export default React.memo(WrappedNode);
