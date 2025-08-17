import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Trash2, Edit3, Plus } from 'lucide-react';
import './BlogManager.css';

interface BlogPost {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  description: string;
  createdAt: any;
}

const BlogManager: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    category: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const blogsRef = collection(db, 'blogs');
      const snapshot = await getDocs(blogsRef);
      const blogData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setBlogs(blogData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingBlog) {
        const blogRef = doc(db, 'blogs', editingBlog.id);
        await updateDoc(blogRef, formData);
      } else {
        await addDoc(collection(db, 'blogs'), {
          ...formData,
          createdAt: Timestamp.now()
        });
      }
      
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      imageUrl: blog.imageUrl,
      category: blog.category,
      description: blog.description
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteDoc(doc(db, 'blogs', id));
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      imageUrl: '',
      category: '',
      description: ''
    });
    setEditingBlog(null);
    setShowForm(false);
  };

  return (
    <div className="blog-manager">
      <div className="manager-header">
        <h2>Blog Posts</h2>
        <button 
          className="add-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={20} />
          Add New Blog
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h3>{editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                <label>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                  {loading ? 'Saving...' : editingBlog ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="items-grid">
        {blogs.map((blog) => (
          <div key={blog.id} className="item-card">
            <img src={blog.imageUrl} alt={blog.title} />
            <div className="item-content">
              <div className="item-category">{blog.category}</div>
              <h4>{blog.title}</h4>
              <p>{blog.description}</p>
              <div className="item-actions">
                <button onClick={() => handleEdit(blog)}>
                  <Edit3 size={16} />
                </button>
                <button onClick={() => handleDelete(blog.id)}>
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

export default BlogManager;