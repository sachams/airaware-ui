import React from "react";
import { Carousel, RadioGroup, Radio, Divider } from "rsuite";
import "./wrapped.css";
import PictureBreach from "./picture-breach";
import WrappedHeatmap from "./wrapped-heatmap";
import WrappedRanking from "./wrapped-ranking";

function Wrapped({ year }) {
  const dateRange = [new Date(year, 0, 1), new Date(year, 11, 31)];

  const data = {
    ranking: {
      pm25: { rank: 5, value: 10.2 },
      no2: { rank: 10, value: 35.5 },
    },
  };

  return (
    <>
      <div className="bg-image">
        <WrappedRanking data={data.ranking} series="pm25" year={2023} />
        <WrappedRanking data={data.ranking} series="no2" year={2023} />
      </div>
    </>
  );
}

export default Wrapped;

{
  /* <PictureBreach
siteCode="CLDP0467"
series="no2"
dateRange={dateRange}
threshold={15}
/>
<PictureBreach
siteCode="CLDP0467"
series="pm25"
dateRange={dateRange}
threshold={15}
/> */
}
