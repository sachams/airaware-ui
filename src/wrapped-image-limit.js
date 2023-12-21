import * as React from "react";
import "./wrapped-image-limit.css";
import Units from "./units";

function WrappedImageLimit({ description, threshold, value, image }) {
  const copy = `${
    value > threshold ? "Higher" : "Lower"
  } than the ${description} of ${threshold}`;
  const colourClass = value > threshold ? "red-fill" : "green-fill";

  // const getImage = (imageName) => {
  //   switch (imageName) {
  //     case "snowman":
  //       return snowman;
  //     case "cane":
  //       return cane;
  //     default:
  //       return baubel;
  //   }
  // };

  // const image = getImage(imageName);

  return (
    <div className="icon-wrapper">
      <img className={`icon-image ${colourClass}`} src={image} />
      <p className="icon-narrative">
        {copy}
        <Units />
      </p>
    </div>
  );
}

export default React.memo(WrappedImageLimit);
