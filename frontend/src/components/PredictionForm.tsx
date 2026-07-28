import { useState, type FormEvent } from "react";
import locations from "../data/locations.json";
import {
  FACING_OPTIONS,
  FURNISHING_OPTIONS,
  OWNERSHIP_OPTIONS,
  STATUS_OPTIONS,
  TRANSACTION_OPTIONS,
  type PredictionRequest,
} from "../types/prediction";
import "./PredictionForm.css";

interface PredictionFormProps {
  onSubmit: (data: PredictionRequest) => void;
  isSubmitting: boolean;
  errorMessage?: string | null;
}

type FormState = {
  location: string;
  carpet_area_sqft: string;
  floor_num: string;
  bathroom: string;
  balcony: string;
  car_parking: string;
  furnishing: string;
  transaction: string;
  ownership: string;
  facing: string;
  status: string;
};

const initialState: FormState = {
  location: (locations as string[])[0] ?? "other",
  carpet_area_sqft: "",
  floor_num: "",
  bathroom: "1",
  balcony: "0",
  car_parking: "0",
  furnishing: FURNISHING_OPTIONS[1],
  transaction: TRANSACTION_OPTIONS[1],
  ownership: OWNERSHIP_OPTIONS[0],
  facing: FACING_OPTIONS[0],
  status: STATUS_OPTIONS[0],
};

export default function PredictionForm({ onSubmit, isSubmitting, errorMessage }: PredictionFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!form.location.trim()) errors.location = "Required";

    const area = Number(form.carpet_area_sqft);
    if (!form.carpet_area_sqft || Number.isNaN(area) || area <= 0) {
      errors.carpet_area_sqft = "Enter an area greater than 0";
    }

    if (form.floor_num === "" || Number.isNaN(Number(form.floor_num))) {
      errors.floor_num = "Enter a floor number";
    }

    for (const key of ["bathroom", "balcony", "car_parking"] as const) {
      const val = Number(form[key]);
      if (form[key] === "" || Number.isNaN(val) || val < 0) {
        errors[key] = "Enter a non-negative number";
      }
    }

    return errors;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    onSubmit({
      location: form.location,
      carpet_area_sqft: Number(form.carpet_area_sqft),
      floor_num: Number(form.floor_num),
      bathroom: Number(form.bathroom),
      balcony: Number(form.balcony),
      car_parking: Number(form.car_parking),
      furnishing: form.furnishing,
      transaction: form.transaction,
      ownership: form.ownership,
      facing: form.facing,
      status: form.status,
    });
  }

  return (
    <form className="drawing-form" onSubmit={handleSubmit} noValidate>
      <fieldset className="field-group" disabled={isSubmitting}>
        <legend>Location &amp; Area</legend>

        <label className="field">
          <span className="field-label">Location</span>
          <select value={form.location} onChange={(e) => update("location", e.target.value)}>
            {(locations as string[]).map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Carpet area (sqft)</span>
          <input
            type="number"
            min={1}
            step="any"
            placeholder="e.g. 1200"
            value={form.carpet_area_sqft}
            onChange={(e) => update("carpet_area_sqft", e.target.value)}
            aria-invalid={Boolean(fieldErrors.carpet_area_sqft)}
          />
          {fieldErrors.carpet_area_sqft && <span className="field-error">{fieldErrors.carpet_area_sqft}</span>}
        </label>

        <label className="field">
          <span className="field-label">Floor number</span>
          <input
            type="number"
            step={1}
            placeholder="0 = ground, -1 = basement"
            value={form.floor_num}
            onChange={(e) => update("floor_num", e.target.value)}
            aria-invalid={Boolean(fieldErrors.floor_num)}
          />
          {fieldErrors.floor_num && <span className="field-error">{fieldErrors.floor_num}</span>}
        </label>
      </fieldset>

      <fieldset className="field-group" disabled={isSubmitting}>
        <legend>Rooms &amp; Parking</legend>

        <div className="field-row">
          <label className="field">
            <span className="field-label">Bathrooms</span>
            <input
              type="number"
              min={0}
              value={form.bathroom}
              onChange={(e) => update("bathroom", e.target.value)}
              aria-invalid={Boolean(fieldErrors.bathroom)}
            />
          </label>
          <label className="field">
            <span className="field-label">Balconies</span>
            <input
              type="number"
              min={0}
              value={form.balcony}
              onChange={(e) => update("balcony", e.target.value)}
              aria-invalid={Boolean(fieldErrors.balcony)}
            />
          </label>
          <label className="field">
            <span className="field-label">Car parking</span>
            <input
              type="number"
              min={0}
              value={form.car_parking}
              onChange={(e) => update("car_parking", e.target.value)}
              aria-invalid={Boolean(fieldErrors.car_parking)}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="field-group" disabled={isSubmitting}>
        <legend>Property Details</legend>

        <div className="field-row">
          <label className="field">
            <span className="field-label">Furnishing</span>
            <select value={form.furnishing} onChange={(e) => update("furnishing", e.target.value)}>
              {FURNISHING_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Transaction</span>
            <select value={form.transaction} onChange={(e) => update("transaction", e.target.value)}>
              {TRANSACTION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            <span className="field-label">Ownership</span>
            <select value={form.ownership} onChange={(e) => update("ownership", e.target.value)}>
              {OWNERSHIP_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Facing</span>
            <select value={form.facing} onChange={(e) => update("facing", e.target.value)}>
              {FACING_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="field">
          <span className="field-label">Status</span>
          <select value={form.status} onChange={(e) => update("status", e.target.value)}>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
      </fieldset>

      {errorMessage && <p className="form-alert">{errorMessage}</p>}

      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? "Calculating…" : "Estimate price"}
      </button>
    </form>
  );
}
