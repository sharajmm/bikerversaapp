import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import Navbar from "../../components/Navbar/Navbar";
import "./Brands.css";

interface Brand {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: any;
}

const Brands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsRef = collection(db, "brands");
        const snapshot = await getDocs(brandsRef);
        const brandData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Brand[];

        setBrands(brandData);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="brands">
        <Navbar />
        <div className="brands-loading">
          <div className="loading-spinner"></div>
          <p>Loading brands...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="brands">
      <Navbar />
      <div className="brands-container">
        <div className="brands-header">
          <h1 className="brands-title">Bike Brands</h1>
          <p className="brands-subtitle">
            Explore our collection of premium bike brands
          </p>
        </div>

        {brands.length === 0 ? (
          <div className="brands-empty">
            <p>No brands available yet.</p>
          </div>
        ) : (
          <div className="brands-grid">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/brands/${brand.id}`}
                className="brand-card"
              >
                <div className="brand-image-container">
                  <img
                    src={brand.imageUrl}
                    alt={brand.name}
                    className="brand-image"
                  />
                  <div className="brand-overlay">
                    <h3 className="brand-name">{brand.name}</h3>
                  </div>
                </div>
                <div className="brand-content">
                  {typeof brand.description === "string" && (
                    <div
                      className="brand-description"
                      dangerouslySetInnerHTML={{ __html: brand.description }}
                    />
                  )}
                  <span className="brand-link-text">View Bikes →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Brands;
