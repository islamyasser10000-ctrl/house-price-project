import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <>
      <header className="sheet-header">
        <div>
          <p className="sheet-eyebrow">House Price Estimator</p>
          <h1 className="sheet-title">Sheet Not Found</h1>
        </div>
      </header>
      <p style={{ marginBottom: 24 }}>
        There's no drawing at this address. It may have been moved or never existed.
      </p>
      <Link to="/" className="back-link">
        ← Back to the estimator
      </Link>
    </>
  );
}
