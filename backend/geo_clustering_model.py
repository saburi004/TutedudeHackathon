import pandas as pd
import numpy as np
from geopy.distance import geodesic
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import joblib
from pathlib import Path

DATA_PATH   = Path("indian_sellers_dataset.csv")  
MODEL_DIR   = Path("models")
MODEL_DIR.mkdir(exist_ok=True)

SCALER_F    = MODEL_DIR / "geo_scaler.pkl"
KMEANS_F    = MODEL_DIR / "geo_kmeans.pkl"
K_CLUSTERS  = 5  # Based on Elbow/Silhouette
W_DISTANCE  = 0.4
W_PRICE     = 0.3
W_RATING    = 0.3

def train_and_save_model():
    df = pd.read_csv(DATA_PATH)
    assert {"Latitude", "Longitude", "Product", "Price_per_kg", "Rating"}.issubset(df.columns)

    X = df[["Latitude", "Longitude"]]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    kmeans = KMeans(n_clusters=K_CLUSTERS, n_init=20, random_state=42)
    df["Cluster"] = kmeans.fit_predict(X_scaled)

    joblib.dump(scaler, SCALER_F)
    joblib.dump(kmeans, KMEANS_F)
    df.to_csv(DATA_PATH, index=False)

    print("✅ Model trained and saved successfully.")


def load_model_and_data():
    scaler = joblib.load(SCALER_F)
    kmeans = joblib.load(KMEANS_F)
    df = pd.read_csv(DATA_PATH)
    return scaler, kmeans, df


def _norm(series: pd.Series) -> pd.Series:
    rng = series.max() - series.min()
    return (series - series.min()) / (rng if rng else 1)


def get_top_sellers(
    buyer_lat: float,
    buyer_lon: float,
    product: str,
    top_n: int = 20,
    kmeans_model=None,
    scaler_model=None,
    full_df=None
) -> pd.DataFrame:
    """
    Returns top‑N sellers for a given buyer location and product.
    Ranking = weighted score of distance, price, rating.
    """
    if not all([kmeans_model, scaler_model, full_df is not None]):
        scaler_model, kmeans_model, full_df = load_model_and_data()

    # Predict cluster
    buyer_scaled = scaler_model.transform([[buyer_lat, buyer_lon]])
    buyer_cluster = int(kmeans_model.predict(buyer_scaled)[0])

    # Filter: same cluster + same product + in stock
    cand = full_df[
        (full_df["Cluster"] == buyer_cluster) &
        (full_df["Product"].str.lower() == product.lower()) &
        (full_df["Stock_quantity"] > 0)
    ].copy()

    if cand.empty:
        return pd.DataFrame(columns=["Name", "Distance_km", "Price_per_kg",
                                     "Rating", "Score"]).assign(Note="No seller found in same cluster")

    # Distance & normalize
    cand["Distance_km"] = cand.apply(
        lambda r: geodesic((buyer_lat, buyer_lon), (r["Latitude"], r["Longitude"])).km,
        axis=1
    )
    cand["dist_norm"]   = _norm(cand["Distance_km"])
    cand["price_norm"]  = _norm(cand["Price_per_kg"])
    cand["rating_norm"] = cand["Rating"] / 5.0

    # Score
    cand["Score"] = (
        W_DISTANCE * (1 - cand["dist_norm"]) +
        W_PRICE    * (1 - cand["price_norm"]) +
        W_RATING   * cand["rating_norm"]
    )

    return (
        cand.sort_values("Score", ascending=False)
            .head(top_n)
            .loc[:, ["Seller_ID", "Locality", "Name", "Distance_km",
                     "Price_per_kg", "Rating", "Verified", "Score"]]
            .reset_index(drop=True)
    )


if __name__ == "__main__":
    # Step 1: Train only once when dataset updates
    train_and_save_model()

    # Step 2: Test example (Swargate, Potatoes)
    # lat, lon = 18.5018, 73.8586
    # product = "Potatoes"
    # scaler, kmeans, df = load_model_and_data()
    # result = get_top_sellers(lat, lon, product, top_n=20, 
    #                          kmeans_model=kmeans, scaler_model=scaler, full_df=df)
    # print("🔍 Top Sellers near buyer:\n", result)
