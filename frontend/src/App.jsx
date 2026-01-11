import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FileView from "./pages/FileView";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/file/:id" element={<FileView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
