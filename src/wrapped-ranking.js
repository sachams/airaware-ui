import * as React from "react";
import "./wrapped-ranking.css";
import "./wrapped-panel.css";
import { getSeriesName, nthNumber, thresholds } from "./utils";
import Units from "./units";

import WrappedImageLimit from "./wrapped-image-limit";
import WrappedPanel from "./wrapped-panel";

import snowman from "./img/snowman-66.svg";
import cane from "./img/cane-32.svg";
import baubel from "./img/baubel-07.svg";

function WrappedRanking({ data, year, series }) {
  return (
    <WrappedPanel>
      <div className="wrapped-panel-header">
        <p className="wrapped-panel-number">
          {data[series].rank}
          <span style={{ fontSize: "20px", verticalAlign: "baseline" }}>
            {nthNumber(data[series].rank)}
          </span>
        </p>
        <p className="wrapped-panel-title">
          best {getSeriesName(series)} level in London (
          {data[series].value.toFixed(2)}
          <Units /> average)
        </p>
      </div>
      <WrappedImageLimit
        description={thresholds[series].who.description}
        threshold={thresholds[series].who.value}
        value={data[series].value}
        image={snowman}
      />
      <WrappedImageLimit
        description={thresholds[series].uk.description}
        threshold={thresholds[series].uk.value}
        value={data[series].value}
        image={baubel}
      />
      <div style={{ height: "60px" }} />
      <p className="wrapped-panel-footer">
        1st = best air quality, ranked out of 510 nodes in London by average{" "}
        {getSeriesName(series)} levels in {year}
      </p>
    </WrappedPanel>
  );
}

export default React.memo(WrappedRanking);
