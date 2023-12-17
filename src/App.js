import "./App.css";
import DataMap from "./datamap";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DataMap />} />
      </Routes>
    </>
  );
}

export default App;
