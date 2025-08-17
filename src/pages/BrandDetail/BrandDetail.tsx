import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Navbar from '../../components/Navbar/Navbar';
import './BrandDetail.css';

interface Brand {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface Bike {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
  price: string;
  description: string;
  brandId: string;
}

const BrandDetail: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandAndBikes = async () => {
      if (!brandId) return;

      try {
        // Fetch brand details
        const brandRef = doc(db, 'brands', brandId);
        const brandSnap = await getDoc(brandRef);
        
        if (brandSnap.exists()) {
          setBrand({ id: brandSnap.id, ...brandSnap.data() } as Brand);
        }

        // Fetch bikes for this brand
        const bikesRef = collection(db, 'bikes');
        const bikesQuery = query(bikesRef, where('brandId', '==', brandId));
        const bikesSnap = await getDocs(bikesQuery);
        
        const bikesData = bikesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Bike[];
        
        setBikes(bikesData);
      } catch (error) {
        console.error('Error fetching brand and bikes:', error);
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
        <div className="brand-detail-header">
          <div className="brand-detail-image">
            <img src={brand.imageUrl} alt={brand.name} />
          </div>
          <div className="brand-detail-info">
            <h1 className="brand-detail-title">{brand.name}</h1>
            <p className="brand-detail-description">{brand.description}</p>
          </div>
        </div>

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
                  <div className="bike-image-container">
                    <img src={bike.imageUrl} alt={bike.name} className="bike-image" />
                    <div className="bike-type">{bike.type}</div>
                  </div>
                  <div className="bike-content">
                    <h3 className="bike-name">{bike.name}</h3>
                    <p className="bike-description">{bike.description}</p>
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