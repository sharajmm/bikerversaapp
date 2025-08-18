import React, { useState, useEffect } from "react";
// Simple gallery component for bike images
const BikeGallery: React.FC<{ images: string[]; name: string }> = ({
  images,
  name,
}) => {
  const [mainIdx, setMainIdx] = React.useState(0);
  if (!images || images.length === 0) return null;
  return (
    <div className="bike-gallery">
      <img
        src={images[mainIdx]}
        alt={name}
        className="bike-image main-image"
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
      <div
        className="bike-thumbnails"
        style={{ display: "flex", gap: "8px", marginTop: "8px" }}
      >
        {images.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`${name} ${idx + 1}`}
            className={mainIdx === idx ? "thumbnail selected" : "thumbnail"}
            style={{
              width: "48px",
              height: "48px",
              objectFit: "cover",
              borderRadius: "4px",
              border: mainIdx === idx ? "2px solid #007bff" : "1px solid #ccc",
              cursor: "pointer",
            }}
            onClick={() => setMainIdx(idx)}
          />
        ))}
      </div>
    </div>
  );
};
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import Navbar from "../../components/Navbar/Navbar";
import "./BrandDetail.css";

interface Brand {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface Bike {
  id: string;
  name: string;
  images: string[]; // Array of image URLs
  imageUrl?: string; // Fallback for legacy data
  type: string;
  price: string;
  description: string;
  brandId: string;
}

const BrandDetail: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const navigate = useNavigate();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandAndBikes = async () => {
      if (!brandId) return;

      try {
        // Fetch brand details
        const brandRef = doc(db, "brands", brandId);
        const brandSnap = await getDoc(brandRef);

        if (brandSnap.exists()) {
          setBrand({ id: brandSnap.id, ...brandSnap.data() } as Brand);
        }

        // Fetch bikes for this brand
        const bikesRef = collection(db, "bikes");
        const bikesQuery = query(bikesRef, where("brandId", "==", brandId));
        const bikesSnap = await getDocs(bikesQuery);

        const bikesData = bikesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Bike[];

        setBikes(bikesData);
      } catch (error) {
        console.error("Error fetching brand and bikes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandAndBikes();
  }, [brandId]);

  if (loading) {
    return (
      <div className="brand-detail">
        <Navbar />
        <div className="brand-detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading brand details...</p>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="brand-detail">
        <Navbar />
        <div className="brand-detail-error">
          <p>Brand not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="brand-detail">
      <Navbar />
      <div className="brand-detail-container">
        <button
          className="go-back-btn"
          onClick={() => navigate(-1)}
          style={{
            marginBottom: "1.5rem",
            padding: "0.7rem 1.5rem",
            background: "none",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              marginRight: "8px",
              fontSize: "1.2em",
              lineHeight: "1",
            }}
          >
            ←
          </span>
          Back
        </button>
        <div className="bikes-section">
          <h2 className="bikes-title">Available Bikes</h2>
          {bikes.length === 0 ? (
            <div className="bikes-empty">
              <p>No bikes available for this brand yet.</p>
            </div>
          ) : (
            <div className="bikes-grid">
              {bikes.map((bike) => (
                <div key={bike.id} className="bike-card">
                  <BikeGallery
                    images={
                      Array.isArray(bike.images) && bike.images.length > 0
                        ? bike.images
                        : bike.imageUrl
                        ? [bike.imageUrl]
                        : []
                    }
                    name={bike.name}
                  />
                  <div className="bike-type">{bike.type}</div>
                  <div className="bike-content">
                    <h3 className="bike-name">{bike.name}</h3>
                    {typeof bike.description === "string" && (
                      <div
                        className="bike-description"
                        dangerouslySetInnerHTML={{
                          __html:
                            bike.description.length > 620
                              ? bike.description.slice(0, 620) + "..."
                              : bike.description,
                        }}
                      />
                    )}
                    <div className="bike-price">{bike.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandDetail;
