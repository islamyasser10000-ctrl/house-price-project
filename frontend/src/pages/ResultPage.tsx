import { Link, Navigate, useLocation } from "react-router-dom";
import type { PredictionRequest } from "../types/prediction";
import "./ResultPage.css";

interface ResultState {
  predictedPrice: number;
  inputs: PredictionRequest;
}

function formatInrCompact(value: number): string {
  if (value >= 1e7) return `₹ ${(value / 1e7).toFixed(2)} Cr`;
  if (value >= 1e5) return `₹ ${(value / 1e5).toFixed(2)} Lac`;
  return `₹ ${Math.round(value).toLocaleString("en-IN")}`;
}

function formatInrFull(value: number): string {
  return `₹ ${Math.round(value).toLocaleString("en-IN")}`;
}

export default function ResultPage() {
  const location = useLocation();
  const state = location.state as ResultState | null;

  // Guard against someone navigating to /result directly without a prediction in hand
  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { predictedPrice, inputs } = state;

  return (
    <>
      <header className="sheet-header">
        <div>
          <p className="sheet-eyebrow">House Price Estimator</p>
          <h1 className="sheet-title">Estimated Valuation</h1>
        </div>
        <p className="sheet-scale">
          SCALE — N.T.S.
          <br />
          REV. 01
        </p>
      </header>

      <div className="stamp-area">
        <div className="stamp">
          <span className="stamp-label">Estimated at</span>
          <span className="stamp-value">{formatInrCompact(predictedPrice)}</span>
        </div>
        <p className="stamp-leader">
          <span className="stamp-leader-line" />
          full figure: {formatInrFull(predictedPrice)}
        </p>
      </div>

      <dl className="spec-list">
        <div className="spec-row">
          <dt>Location</dt>
          <dd>{inputs.location}</dd>
        </div>
        <div className="spec-row">
          <dt>Carpet area</dt>
          <dd>{inputs.carpet_area_sqft} sqft</dd>
        </div>
        <div className="spec-row">
          <dt>Floor</dt>
          <dd>{inputs.floor_num}</dd>
        </div>
        <div className="spec-row">
          <dt>Bathrooms / Balconies / Parking</dt>
          <dd>
            {inputs.bathroom} / {inputs.balcony} / {inputs.car_parking}
          </dd>
        </div>
        <div className="spec-row">
          <dt>Furnishing</dt>
          <dd>{inputs.furnishing}</dd>
        </div>
        <div className="spec-row">
          <dt>Transaction</dt>
          <dd>{inputs.transaction}</dd>
        </div>
        <div className="spec-row">
          <dt>Ownership</dt>
          <dd>{inputs.ownership}</dd>
        </div>
        <div className="spec-row">
          <dt>Facing</dt>
          <dd>{inputs.facing}</dd>
        </div>
        <div className="spec-row">
          <dt>Status</dt>
          <dd>{inputs.status}</dd>
        </div>
      </dl>

      <Link to="/" className="back-link">
        ← Estimate another property
      </Link>
    </>
  );
}
