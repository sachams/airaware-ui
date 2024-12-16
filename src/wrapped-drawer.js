import "./wrapped-drawer.css";

import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { Drawer } from "rsuite";

import { useMediaQuery } from "./hooks";
import DesktopImage from "./img/wrapped-desktop.png";
import MobileImage from "./img/wrapped-mobile.png";
import WrappedPresentation from "./wrapped-presentation";
import wrappedData2023 from "./wrapped_2023.json";
import wrappedData2024 from "./wrapped_2024.json";

function WrappedDrawer({ year, onClose }) {
  const params = useParams();
  const [nodeData, setNodeData] = useState(undefined);

  const isMobile = useMediaQuery("(max-width: 767px)");
  const styles = {
    container: (isMobile) => ({
      backgroundSize: "cover",
      padding: "30px",
      backgroundImage: `url(${isMobile ? MobileImage : DesktopImage})`,
    }),
  };

  useEffect(() => {
    switch (year) {
      case 2023:
        console.log("Loading wrapped 2023 data");
        setNodeData(
          wrappedData2023.find(
            (node) => node.details.site_code === params.siteCode
          )
        );
        break;
      case 2024:
        console.log("Loading wrapped 2024 data");
        setNodeData(
          wrappedData2024.find(
            (node) => node.details.site_code === params.siteCode
          )
        );
        break;
    }
  }, [year]);

  return (
    nodeData && (
      <Drawer size="full" backdrop={true} open={true} onClose={onClose}>
        <Drawer.Body style={styles.container(isMobile)}>
          <WrappedPresentation
            data={nodeData}
            year={year}
          ></WrappedPresentation>
        </Drawer.Body>
      </Drawer>
    )
  );
}

export default React.memo(WrappedDrawer);
