import React from "react";
import { Carousel, RadioGroup, Radio, Divider } from "rsuite";
import "./wrapped.css";
import PictureBreach from "./picture-breach";

function Wrapped({ year }) {
  const dateRange = [new Date(year, 0, 1), new Date(year, 11, 31)];

  return (
    <>
      <div className="bg-image">
        <PictureBreach
          siteCode="CLDP0467"
          series="no2"
          dateRange={dateRange}
          threshold={15}
        />
      </div>
    </>
  );
}

export default Wrapped;
