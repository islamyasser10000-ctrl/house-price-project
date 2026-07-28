import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ResultPage from "./pages/ResultPage";

function SheetMarks() {
  return (
    <>
      <span className="sheet-mark sheet-mark--tl" />
      <span className="sheet-mark sheet-mark--tr" />
      <span className="sheet-mark sheet-mark--bl" />
      <span className="sheet-mark sheet-mark--br" />
    </>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <div className="sheet">
              <SheetMarks />
              <HomePage />
            </div>
          }
        />
        <Route
          path="/result"
          element={
            <div className="sheet">
              <SheetMarks />
              <ResultPage />
            </div>
          }
        />
        <Route
          path="*"
          element={
            <div className="sheet">
              <SheetMarks />
              <NotFoundPage />
            </div>
          }
        />
      </Routes>
      <p className="app-footer">DWG NO. HP-01 · SURVEY ESTIMATE · NOT A LEGAL VALUATION</p>
    </>
  );
}
