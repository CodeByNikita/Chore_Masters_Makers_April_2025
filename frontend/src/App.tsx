import { Routes, Route, BrowserRouter } from "react-router";
import Parent from "./pages/Parent";
import Child from "./pages/Child";
import Homepage from "./pages/Homepage";
import NotFound from "./pages/NotFound";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/parent" element={<Parent />} />
        <Route path="/child" element={<Child />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
