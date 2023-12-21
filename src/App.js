import "./App.css";
import DataMap from "./datamap";
import Wrapped from "./wrapped";
import NoMatch from "./no-match";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DataMap />} />
        <Route path="/wrapped" element={<Wrapped year={2023} />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
}

export default App;
