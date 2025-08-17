import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Trash2, Edit3, Plus } from 'lucide-react';
import './BlogManager.css';

interface Brand {
  id: string;
  name: string;
}

interface Bike {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
  price: string;
  description: string;
  brandId: string;
  createdAt: any;
}

const BikeManager: React.FC = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBike, setEditingBike] = useState<Bike | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    type: '',
    price: '',
    description: '',
    brandId: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBikes();
    fetchBrands();
  }, []);

  const fetchBikes = async () => {
    try {
      const bikesRef = collection(db, 'bikes');
      const snapshot = await getDocs(bikesRef);
      const bikeData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Bike[];
      setBikes(bikeData);
    } catch (error) {
      console.error('Error fetching bikes:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const brandsRef = collection(db, 'brands');
      const snapshot = await getDocs(brandsRef);
      const brandData = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      })) as Brand[];
      setBrands(brandData);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingBike) {
        const bikeRef = doc(db, 'bikes', editingBike.id);
        await updateDoc(bikeRef, formData);
      } else {
        await addDoc(collection(db, 'bikes'), {
          ...formData,
          createdAt: Timestamp.now()
        });
      }
      
      resetForm();
      fetchBikes();
    } catch (error) {
      console.error('Error saving bike:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bike: Bike) => {
    setEditingBike(bike);
    setFormData({
      name: bike.name,
      imageUrl: bike.imageUrl,
      type: bike.type,
      price: bike.price,
      description: bike.description,
      brandId: bike.brandId
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this bike?')) {
      try {
        await deleteDoc(doc(db, 'bikes', id));
        fetchBikes();
      } catch (error) {
        console.error('Error deleting bike:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      imageUrl: '',
      type: '',
      price: '',
      description: '',
      brandId: ''
    });
    setEditingBike(null);
    setShowForm(false);
  };

  const getBrandName = (brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    return brand ? brand.name : 'Unknown Brand';
  };

  return (
    <div className="blog-manager">
      <div className="manager-header">
        <h2>Bikes</h2>
        <button 
          className="add-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={20} />
          Add New Bike
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h3>{editingBike ? 'Edit Bike' : 'Add New Bike'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Type</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  required
                  placeholder="e.g. Mountain, Road, Electric"
                />
              </div>
              
              <div className="form-group">
                <label>Price</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                  placeholder="e.g. $1,299"
                />
              </div>
              
              <div className="form-group">
                <label>Brand</label>
                <select
                  value={formData.brandId}
                  onChange={(e) => setFormData({...formData, brandId: e.target.value})}
                  required
                >
                  <option value="">Select a brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={resetForm}>Cancel</button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingBike ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="items-grid">
        {bikes.map((bike) => (
          <div key={bike.id} className="item-card">
            <img src={bike.imageUrl} alt={bike.name} />
            <div className="item-content">
              <div className="item-category">{bike.type} • {getBrandName(bike.brandId)}</div>
              <h4>{bike.name}</h4>
              <p>{bike.description}</p>
              <div className="bike-price">{bike.price}</div>
              <div className="item-actions">
                <button onClick={() => handleEdit(bike)}>
                  <Edit3 size={16} />
                </button>
                <button onClick={() => handleDelete(bike.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BikeManager;