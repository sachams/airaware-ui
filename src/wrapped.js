import React from "react";
import { Carousel, RadioGroup, Radio, Divider } from "rsuite";
import "./wrapped.css";
import WrappedBreach from "./wrapped-breach";
import WrappedHeatmap from "./wrapped-heatmap";
import WrappedRanking from "./wrapped-ranking";

function Wrapped({ year }) {
  const data = {
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

  return (
    <>
      <div className="bg-image">
        <WrappedBreach data={data.breach} series="pm25" year={year} />
        <WrappedBreach data={data.breach} series="no2" year={year} />
        <WrappedRanking data={data.ranking} series="pm25" year={year} />
        <WrappedRanking data={data.ranking} series="no2" year={year} />
      </div>
    </>
  );
}

export default Wrapped;
