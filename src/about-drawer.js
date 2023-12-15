import React from "react";
import { Drawer } from "rsuite";
import "./about-drawer.css";

function AboutDrawer({ isOpen, setAboutDrawerOpen }) {
  return (
    <Drawer
      size="full"
      backdrop={true}
      open={isOpen}
      onClose={() => setAboutDrawerOpen(false)}
    >
      <Drawer.Header>
        <Drawer.Title>About Air Aware</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <h2>What is Air Aware?</h2>

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
        <h2>Data sources</h2>
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
        <h2>Feedback</h2>
        <p>
          What should we build next? What problems are you trying to
          investigate, and how can we build tools that will help? Please let us
          know on our{" "}
          <a href="https://air-aware.canny.io/" target="_blank">
            Feature Requests board
          </a>
        </p>
      </Drawer.Body>
    </Drawer>
  );
}

export default React.memo(AboutDrawer);
