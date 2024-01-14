import React, { useState } from "react";
import WrappedPresentation from "./wrapped-presentation";
import { Drawer } from "rsuite";
import { useMediaQuery } from "./hooks";

import "./wrapped-drawer.css";
import DesktopImage from "./img/wrapped-desktop.png";
import MobileImage from "./img/wrapped-mobile.png";
import wrappedData from "./wrapped_2023.json";
import { useParams } from "react-router-dom";

function WrappedDrawer({ year, onClose }) {
  const params = useParams();

  const isMobile = useMediaQuery("(max-width: 767px)");
  const styles = {
    container: (isMobile) => ({
      backgroundSize: "cover",
      padding: "30px",
      backgroundImage: `url(${isMobile ? MobileImage : DesktopImage})`,
    }),
  };

  const nodeData = wrappedData.find(
    (node) => node.details.site_code === params.siteCode
  );

  return (
    <Drawer size="full" backdrop={true} open={true} onClose={onClose}>
      <Drawer.Body style={styles.container(isMobile)}>
        <WrappedPresentation data={nodeData} year={year}></WrappedPresentation>
      </Drawer.Body>
    </Drawer>
  );
}

export default React.memo(WrappedDrawer);
