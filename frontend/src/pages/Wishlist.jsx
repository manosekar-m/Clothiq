import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import { FiHeart } from 'react-icons/fi';

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await api.post('/wishlist/toggle', { productId: id });
      setProducts(products.filter(p => p._id !== id));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Action failed');
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80, color: 'var(--text2)' }}>Loading...</div>;

  return (
    <div className="container page">
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <h1 className="page-title">My Wishlist</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Items you've saved for later</p>
      </div>

      {products.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px', 
          background: 'var(--bg2)', 
          borderRadius: 20, 
          border: '1px dashed var(--border)' 
        }}>
          <FiHeart size={48} style={{ color: 'var(--border)', marginBottom: 16 }} />
          <p style={{ color: 'var(--text2)', fontSize: 16 }}>Your wishlist is empty.</p>
          <button 
            className="btn-primary" 
            style={{ marginTop: 20 }}
            onClick={() => window.location.href = '/'}
          >
            Explore Collection
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: 30 
        }}>
          {products.map(p => (
            <div key={p._id} style={{ position: 'relative' }}>
              <ProductCard product={p} />
              <button 
                onClick={() => removeFromWishlist(p._id)}
                style={{ 
                  position: 'absolute', 
                  top: 12, 
                  right: 12, 
                  background: 'var(--danger)', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: 32, 
                  height: 32, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
