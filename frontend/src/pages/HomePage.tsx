import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, predictPrice } from "../api/predictionClient";
import PredictionForm from "../components/PredictionForm";
import type { PredictionRequest } from "../types/prediction";

export default function HomePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(payload: PredictionRequest) {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await predictPrice(payload);
      navigate("/result", { state: { predictedPrice: result.predicted_price, inputs: payload } });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Couldn't reach the prediction service. Is the backend running?";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <header className="sheet-header">
        <div>
          <p className="sheet-eyebrow">House Price Estimator</p>
          <h1 className="sheet-title">Property Valuation Sheet</h1>
        </div>
        <p className="sheet-scale">
          SCALE — N.T.S.
          <br />
          REV. 01
        </p>
      </header>

      <PredictionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} errorMessage={errorMessage} />
    </>
  );
}
