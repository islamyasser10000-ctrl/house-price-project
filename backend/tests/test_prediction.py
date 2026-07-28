VALID_PAYLOAD = {
    "location": "Whitefield",
    "carpet_area_sqft": 1200,
    "floor_num": 3,
    "bathroom": 2,
    "balcony": 1,
    "car_parking": 1,
    "furnishing": "Semi-Furnished",
    "transaction": "Resale",
    "ownership": "Freehold",
    "facing": "East",
    "status": "Ready to Move",
}


def test_health_reports_model_loaded(client):
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["model_loaded"] is True


def test_predict_happy_path(client):
    response = client.post("/predict", json=VALID_PAYLOAD)
    assert response.status_code == 200

    body = response.json()
    assert "predicted_price" in body
    assert isinstance(body["predicted_price"], float)
    assert body["predicted_price"] > 0


def test_predict_unknown_location_falls_back_to_other(client):
    payload = {**VALID_PAYLOAD, "location": "SomePlaceNeverSeenBefore"}
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    assert response.json()["predicted_price"] > 0


def test_predict_invalid_input_returns_422(client):
    invalid_payload = {**VALID_PAYLOAD, "carpet_area_sqft": -50}  # area must be > 0
    response = client.post("/predict", json=invalid_payload)
    assert response.status_code == 422


def test_predict_missing_required_field_returns_422(client):
    incomplete_payload = {k: v for k, v in VALID_PAYLOAD.items() if k != "location"}
    response = client.post("/predict", json=incomplete_payload)
    assert response.status_code == 422
