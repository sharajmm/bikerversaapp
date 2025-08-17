import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Trash2, Edit3, Plus } from 'lucide-react';
import './BlogManager.css';

interface Brand {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: any;
}

const BrandManager: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const brandsRef = collection(db, 'brands');
      const snapshot = await getDocs(brandsRef);
      const brandData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
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
      if (editingBrand) {
        const brandRef = doc(db, 'brands', editingBrand.id);
        await updateDoc(brandRef, formData);
      } else {
        await addDoc(collection(db, 'brands'), {
          ...formData,
          createdAt: Timestamp.now()
        });
      }
      
      resetForm();
      fetchBrands();
    } catch (error) {
      console.error('Error saving brand:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description,
      imageUrl: brand.imageUrl
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await deleteDoc(doc(db, 'brands', id));
        fetchBrands();
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: ''
    });
    setEditingBrand(null);
    setShowForm(false);
  };

  return (
    <div className="blog-manager">
      <div className="manager-header">
        <h2>Brands</h2>
        <button 
          className="add-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={20} />
          Add New Brand
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h3>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h3>
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
                  {loading ? 'Saving...' : editingBrand ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="items-grid">
        {brands.map((brand) => (
          <div key={brand.id} className="item-card">
            <img src={brand.imageUrl} alt={brand.name} />
            <div className="item-content">
              <h4>{brand.name}</h4>
              <p>{brand.description}</p>
              <div className="item-actions">
                <button onClick={() => handleEdit(brand)}>
                  <Edit3 size={16} />
                </button>
                <button onClick={() => handleDelete(brand.id)}>
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

export default BrandManager;