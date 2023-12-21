import axios from "axios";
import * as React from "react";
import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import "./wrapped-ranking.css";
import { getSeriesName, nthNumber } from "./utils";

import WrappedImageLimit from "./wrapped-image-limit";

import snowman from "./img/snowman-66.svg";
import cane from "./img/cane-32.svg";
import baubel from "./img/baubel-07.svg";

function WrappedRanking({ year, series }) {
  const containerRef = useRef();
  const [data, setData] = useState(undefined);

  useEffect(() => {
    const data = {
      pm25: { rank: 5, value: 10.2 },
      no2: { rank: 10, value: 35.5 },
    };
    setData(data);
  }, []);

  const thresholds = {
    pm25: {
      who: {
        description: "WHO annual guideline",
        value: 25,
      },
      mayor: {
        description: "Mayor of London's limit",
        value: 35,
      },
      uk: {
        description: "UK annual limit",
        value: 45,
      },
    },
    no2: {
      who: {
        description: "WHO annual guideline",
        value: 22,
      },
      mayor: {
        description: "Mayor of London's limit",
        value: 32,
      },
      uk: {
        description: "UK annual limit",
        value: 42,
      },
    },
  };

  return (
    <div id="wrapper">
      {data && (
        <div id="text-wrapper">
          <p id="count">
            {data[series].rank}
            <span style={{ fontSize: "20px", verticalAlign: "baseline" }}>
              {nthNumber(data[series].rank)}
            </span>
          </p>
          <p id="narrative">
            Worst average {getSeriesName(series)} levels in London in {year},
            with an average of {data[series].value} ug/m3
          </p>
        </div>
      )}
      {data && (
        <WrappedImageLimit
          description={thresholds[series].who.description}
          threshold={thresholds[series].who.value}
          value={data[series].value}
          image={snowman}
        />
      )}
      {data && (
        <WrappedImageLimit
          description={thresholds[series].mayor.description}
          threshold={thresholds[series].mayor.value}
          value={data[series].value}
          image={cane}
        />
      )}
      {data && (
        <WrappedImageLimit
          description={thresholds[series].uk.description}
          threshold={thresholds[series].uk.value}
          value={data[series].value}
          image={baubel}
        />
      )}
    </div>
  );
}

export default React.memo(WrappedRanking);
