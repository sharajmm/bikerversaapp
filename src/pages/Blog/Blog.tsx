import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Navbar from '../../components/Navbar/Navbar';
import './Blog.css';

interface BlogPost {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  description: string;
  createdAt: any;
}

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsRef = collection(db, 'blogs');
        const snapshot = await getDocs(blogsRef);
        const blogData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BlogPost[];
        
        // Sort by creation date (newest first)
        blogData.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds;
          }
          return 0;
        });
        
        setBlogs(blogData);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="blog">
        <Navbar />
        <div className="blog-loading">
          <div className="loading-spinner"></div>
          <p>Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog">
      <Navbar />
      <div className="blog-container">
        <div className="blog-header">
          <h1 className="blog-title">Our Blog</h1>
          <p className="blog-subtitle">Latest insights and stories from the biking world</p>
        </div>
        
        {blogs.length === 0 ? (
          <div className="blog-empty">
            <p>No blog posts available yet.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {blogs.map((blog) => (
              <article key={blog.id} className="blog-card">
                <div className="blog-image-container">
                  <img src={blog.imageUrl} alt={blog.title} className="blog-image" />
                  <div className="blog-category">{blog.category}</div>
                </div>
                <div className="blog-content">
                  <h3 className="blog-card-title">{blog.title}</h3>
                  <p className="blog-description">{blog.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;