import type { HealthResponse, PredictionRequest, PredictionResponse } from "../types/prediction";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body?.detail === "string") return body.detail;
    if (Array.isArray(body?.detail)) {
      // FastAPI validation errors (422) come back as a list of {loc, msg, ...}
      return body.detail.map((e: { loc: string[]; msg: string }) => `${e.loc.at(-1)}: ${e.msg}`).join(", ");
    }
  } catch {
    // response wasn't JSON — fall through to a generic message
  }
  return `Request failed with status ${response.status}`;
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }
  return response.json();
}

export async function predictPrice(payload: PredictionRequest): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  return response.json();
}
