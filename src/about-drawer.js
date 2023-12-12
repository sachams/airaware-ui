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
      <Drawer.Body>
        <p>
          Air Aware is a project set up by Sacha Manson-Smith and Louise Thomas
          to look at data from the{" "}
          <a href="https://www.breathelondon.org/" target="_blank">
            Breathe London
          </a>{" "}
          network of air quality sensors. This website helps us (and others)
          analyse the data. You can read more about the project on our{" "}
          <a href="https://airaware.substack.com/" target="_blank">
            Air Aware blog
          </a>
          .
        </p>
        <p>The data comes from the following sources:</p>
        <ul>
          <li>
            Air quality node data -{" "}
            <a href="https://www.breathelondon.org/developers" target="_blank">
              Breathe London API
            </a>
          </li>
          <li>
            LTN datasets -{" "}
            <a
              href="https://blog.westminster.ac.uk/ata/projects/london-ltn-dataset/"
              target="_blank"
            >
              University of Westminster
            </a>
          </li>
        </ul>
      </Drawer.Body>
    </Drawer>
  );
}

export default React.memo(AboutDrawer);
