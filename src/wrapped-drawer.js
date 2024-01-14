import React, { useState } from "react";
import WrappedPresentation from "./wrapped-presentation";
import { Drawer } from "rsuite";
import { useMediaQuery } from "./hooks";

import "./wrapped-drawer.css";
import DesktopImage from "./img/wrapped-desktop.png";
import MobileImage from "./img/wrapped-mobile.png";
import wrappedData from "./wrapped_2023.json";

function WrappedDrawer({ selectedNode, year, onClose }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const styles = {
    container: (isMobile) => ({
      backgroundSize: "cover",
      padding: "30px",
      backgroundImage: `url(${isMobile ? MobileImage : DesktopImage})`,
    }),
  };

  const nodeData = wrappedData.find(
    (node) => node.site_code === selectedNode?.site_code
  );

  return (
    <Drawer size="full" backdrop={true} open={!!selectedNode} onClose={onClose}>
      <Drawer.Body style={styles.container(isMobile)}>
        <WrappedPresentation data={nodeData} year={year}></WrappedPresentation>
      </Drawer.Body>
    </Drawer>
  );
}

export default React.memo(WrappedDrawer);
