import React from "react";
import { Carousel, RadioGroup, Radio, Divider } from "rsuite";
import "./wrapped.css";
import WrappedBreach from "./wrapped-breach";
import WrappedHeatmap from "./wrapped-heatmap";
import WrappedRanking from "./wrapped-ranking";

function Wrapped({ year }) {
  const data = {
    heatmap: {
      pm25: [],
      no2: [],
    },
    breach: {
      pm25: {
        ok: 45,
        breach: 315,
        no_data: 5,
      },
      no2: {
        ok: 40,
        breach: 295,
        no_data: 30,
      },
    },
    ranking: {
      pm25: { rank: 5, value: 10.2 },
      no2: { rank: 10, value: 35.5 },
    },
  };

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      data.heatmap.pm25.push({ day, hour, value: Math.random() * 20 });
      data.heatmap.no2.push({ day, hour, value: Math.random() * 20 });
    }
  }

  return (
    <>
      <div className="bg-image">
        <WrappedBreach data={data.breach} series="pm25" year={year} />
        <WrappedBreach data={data.breach} series="no2" year={year} />
        <WrappedHeatmap data={data.heatmap} series="pm25" year={year} />
        <WrappedHeatmap data={data.heatmap} series="no2" year={year} />
        <WrappedRanking data={data.ranking} series="pm25" year={year} />
        <WrappedRanking data={data.ranking} series="no2" year={year} />
      </div>
    </>
  );
}

export default Wrapped;
