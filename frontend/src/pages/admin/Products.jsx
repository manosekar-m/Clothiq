import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiUpload } from 'react-icons/fi';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountedPrice: '',
    category: 'T-Shirt',
    isNewArrival: true,
    sizes: [
      { size: 'S', quantity: 0 },
      { size: 'M', quantity: 0 },
      { size: 'L', quantity: 0 },
      { size: 'XL', quantity: 0 },
    ],
    images: [],
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    const uploadedImages = [];
    
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await api.post('/products/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedImages.push(data.url);
      }
      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
      toast.success('Images uploaded');
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSizeChange = (sizeLabel, value) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map(s => s.size === sizeLabel ? { ...s, quantity: parseInt(value) || 0 } : s)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
        toast.success('Product updated');
      } else {
        await api.post('/products', formData);
        toast.success('Product created');
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discountedPrice: product.discountedPrice,
      category: product.category,
      isNewArrival: product.isNewArrival,
      sizes: product.sizes,
      images: product.images,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      discountedPrice: '',
      category: 'T-Shirt',
      isNewArrival: true,
      sizes: [
        { size: 'S', quantity: 0 },
        { size: 'M', quantity: 0 },
        { size: 'L', quantity: 0 },
        { size: 'XL', quantity: 0 },
      ],
      images: [],
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 8 }}>Products</h2>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Manage your inventory and product listings</p>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiPlus /> Add New Product
        </button>
      </div>

      <div style={{ 
        background: 'var(--bg2)', 
        borderRadius: 16, 
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)', display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)' }} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 40, background: 'var(--bg3)', border: 'none' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px 20px', color: 'var(--text2)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Product</th>
                <th style={{ padding: '16px 20px', color: 'var(--text2)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '16px 20px', color: 'var(--text2)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Price</th>
                <th style={{ padding: '16px 20px', color: 'var(--text2)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Stock</th>
                <th style={{ padding: '16px 20px', color: 'var(--text2)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img 
                        src={product.images[0] ? (product.images[0].startsWith('http') ? product.images[0] : `/api/uploads/${product.images[0]}`) : 'https://placehold.co/40x40?text=NA'} 
                        alt="" 
                        style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', background: 'var(--bg3)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{product.name}</div>
                        {product.isNewArrival && <span className="badge badge-gold" style={{ marginTop: 4 }}>New Arrival</span>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: 14, color: 'var(--text2)' }}>{product.category}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>₹{product.discountedPrice}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', textDecoration: 'line-through' }}>₹{product.price}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {product.sizes.map(s => (
                        <div key={s.size} style={{ 
                          fontSize: 11, 
                          padding: '2px 6px', 
                          background: s.quantity > 0 ? 'rgba(92, 184, 92, 0.1)' : 'rgba(224, 82, 82, 0.1)',
                          color: s.quantity > 0 ? 'var(--success)' : 'var(--danger)',
                          borderRadius: 4,
                          border: `1px solid ${s.quantity > 0 ? 'rgba(92, 184, 92, 0.2)' : 'rgba(224, 82, 82, 0.2)'}`
                        }}>
                          {s.size}: {s.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEdit(product)} style={{ padding: 8, background: 'none', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text2)', cursor: 'pointer' }}>
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(product._id)} style={{ padding: 8, background: 'none', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--danger)', cursor: 'pointer' }}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', zIndex: 1000, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20
        }}>
          <div style={{ 
            background: 'var(--bg2)', width: '100%', maxWidth: 700, 
            maxHeight: '90vh', overflowY: 'auto', borderRadius: 20,
            border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--bg2)', zIndex: 1 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer' }}>
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: 32 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="form-group">
                  <label className="label">Product Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="label">Category</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="T-Shirt">T-Shirt</option>
                    <option value="Shirt">Shirt</option>
                    <option value="Hoodie">Hoodie</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="label">Description</label>
                <textarea 
                  rows="3" 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
                <div className="form-group">
                  <label className="label">Original Price (₹)</label>
                  <input 
                    type="number" 
                    value={formData.price} 
                    onChange={e => setFormData({ ...formData, price: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="label">Discounted Price (₹)</label>
                  <input 
                    type="number" 
                    value={formData.discountedPrice} 
                    onChange={e => setFormData({ ...formData, discountedPrice: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="label">New Arrival?</label>
                  <div style={{ height: 46, display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="checkbox" 
                      style={{ width: 24, height: 24, cursor: 'pointer' }}
                      checked={formData.isNewArrival}
                      onChange={e => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label className="label">Stock Management (Sizes)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  {formData.sizes.map(s => (
                    <div key={s.size} style={{ background: 'var(--bg3)', padding: 12, borderRadius: 12, border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Size {s.size}</div>
                      <input 
                        type="number" 
                        value={s.quantity} 
                        onChange={e => handleSizeChange(s.size, e.target.value)}
                        style={{ padding: '8px 12px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 32 }}>
                <label className="label">Product Images</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                  {formData.images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', aspectRatio: '1/1' }}>
                      <img 
                        src={img.startsWith('http') ? img : `/api/uploads/${img}`} 
                        alt="" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }}
                      />
                      <button 
                        type="button" 
                        onClick={() => removeImage(idx)}
                        style={{ position: 'absolute', top: -6, right: -6, background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 10 }}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                  <label style={{ 
                    aspectRatio: '1/1', border: '2px dashed var(--border)', 
                    borderRadius: 10, display: 'flex', flexDirection: 'column', 
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    color: 'var(--text2)', transition: 'all 0.2s'
                  }} className="upload-btn">
                    {uploading ? <div className="spinner"></div> : <><FiUpload size={20} /> <span style={{ fontSize: 10, marginTop: 4 }}>Upload</span></>}
                    <input type="file" multiple hidden onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 2 }}>{editingId ? 'Save Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .upload-btn:hover { border-color: var(--accent); color: var(--accent); }
        .spinner { width: 16px; height: 16px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
