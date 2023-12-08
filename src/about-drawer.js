import React from "react";
import { Drawer } from "rsuite";

function AboutDrawer({ isOpen, setAboutDrawerOpen }) {
  return (
    <Drawer
      size="sm"
      backdrop={true}
      open={isOpen}
      onClose={() => setAboutDrawerOpen(false)}
    >
      <Drawer.Header>
        <Drawer.Title>About Air Aware</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>hello</Drawer.Body>
    </Drawer>
  );
}

export default React.memo(AboutDrawer);
