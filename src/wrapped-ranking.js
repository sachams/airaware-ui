import * as React from "react";
import "./wrapped-ranking.css";
import { getSeriesName, nthNumber, thresholds } from "./utils";

import WrappedImageLimit from "./wrapped-image-limit";
import WrappedPanel from "./wrapped-panel";

import snowman from "./img/snowman-66.svg";
import cane from "./img/cane-32.svg";
import baubel from "./img/baubel-07.svg";

function WrappedRanking({ data, year, series }) {
  return (
    <WrappedPanel>
      <div id="text-wrapper">
        <p id="count">
          {data[series].rank}
          <span style={{ fontSize: "20px", verticalAlign: "baseline" }}>
            {nthNumber(data[series].rank)}
          </span>
        </p>
        <p id="narrative">
          Worst average {getSeriesName(series)} levels in London in {year}, with
          an average of {data[series].value} ug/m3
        </p>
      </div>
      <WrappedImageLimit
        description={thresholds[series].who.description}
        threshold={thresholds[series].who.value}
        value={data[series].value}
        image={snowman}
      />
      <WrappedImageLimit
        description={thresholds[series].mayor.description}
        threshold={thresholds[series].mayor.value}
        value={data[series].value}
        image={cane}
      />
      <WrappedImageLimit
        description={thresholds[series].uk.description}
        threshold={thresholds[series].uk.value}
        value={data[series].value}
        image={baubel}
      />
    </WrappedPanel>
  );
}

export default React.memo(WrappedRanking);
