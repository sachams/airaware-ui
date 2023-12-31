import "./App.css";
import { Routes, Route } from "react-router-dom";
import DataMap from "./datamap";
import Wrapped from "./wrapped";
import NoMatch from "./no-match";
import { useState, useEffect } from "react";
import { Button, Modal } from "rsuite";

function App() {
  const [modalOpen, setModalOpen] = useState(true);
  const [showWrapped, setShowWrapped] = useState(true);

  useEffect(() => {
    document.body.classList.add("bg-image-welcome");
  }, []);

  const handleShowWrapped = () => {
    setModalOpen(false);
    setShowWrapped(true);
    document.body.classList.remove("bg-image-welcome");
  };
  const handleShowDatamap = () => {
    setModalOpen(false);
    setShowWrapped(false);
    document.body.classList.remove("bg-image-welcome");
  };

  // <Routes>
  //   <Route path="/" element={<DataMap />} />
  //   <Route path="/wrapped" element={<Wrapped year={2023} />} />
  //   <Route path="*" element={<NoMatch />} />
  // </Routes>

  return (
    <div>
      <Modal open={modalOpen} onClose={handleShowDatamap}>
        <Modal.Header>
          <Modal.Title style={{ textAlign: "center" }}>
            🎁🎁🎁 Air Aware Wrapped 🎁🎁🎁
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            A little gift from Air Aware this Christmas! Unwrap your treasure
            trove of air quality information for where you live.
          </p>
          <p>
            Air pollution is the biggest environmental threat to our health.
            Tackling it will make us happier and healthier. What a Christmas
            gift to give.
          </p>
          <p>
            Pass on to all your London friends! The more people who know about
            air pollution, the more equipped we are to address it!
          </p>
          <p>
            Search for a monitoring station near you then click on it to see
            your report.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleShowDatamap}>
            No thanks, go to the normal map
          </Button>
          <Button onClick={handleShowWrapped} appearance="primary">
            Show me Wrapped!
          </Button>
        </Modal.Footer>
      </Modal>

      {showWrapped && !modalOpen && <Wrapped year={2023} />}
      {!showWrapped && !modalOpen && <DataMap />}
    </div>
  );
}

export default App;
