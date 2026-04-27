import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiTag, FiCalendar, FiDollarSign } from 'react-icons/fi';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountAmount: '',
    minPurchase: '0',
    maxDiscount: '',
    expiryDate: '',
    usageLimit: '100'
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/coupons');
      setCoupons(data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/coupons', form);
      toast.success('Coupon created!');
      setShowModal(false);
      setForm({ code: '', discountType: 'percentage', discountAmount: '', minPurchase: '0', maxDiscount: '', expiryDate: '', usageLimit: '100' });
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success('Deleted');
      setCoupons(coupons.filter(c => c._id !== id));
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 8 }}>Coupons</h2>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Manage discount codes and promotional offers.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FiPlus /> Create Coupon
        </button>
      </div>

      <div style={{ background: 'var(--bg2)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '16px 24px', fontSize: 13, color: 'var(--text2)' }}>CODE</th>
              <th style={{ padding: '16px 24px', fontSize: 13, color: 'var(--text2)' }}>DISCOUNT</th>
              <th style={{ padding: '16px 24px', fontSize: 13, color: 'var(--text2)' }}>MIN. PURCHASE</th>
              <th style={{ padding: '16px 24px', fontSize: 13, color: 'var(--text2)' }}>EXPIRY</th>
              <th style={{ padding: '16px 24px', fontSize: 13, color: 'var(--text2)' }}>USAGE</th>
              <th style={{ padding: '16px 24px', fontSize: 13, color: 'var(--text2)', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => (
              <tr key={coupon._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(232,201,126,0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiTag />
                    </div>
                    <span style={{ fontWeight: 700, letterSpacing: 1 }}>{coupon.code}</span>
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  {coupon.discountAmount}{coupon.discountType === 'percentage' ? '%' : ' ₹'}
                </td>
                <td style={{ padding: '20px 24px' }}>₹{coupon.minPurchase}</td>
                <td style={{ padding: '20px 24px' }}>
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <span style={{ color: coupon.usedCount >= coupon.usageLimit ? 'var(--danger)' : 'var(--success)' }}>
                    {coupon.usedCount} / {coupon.usageLimit}
                  </span>
                </td>
                <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(coupon._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && !loading && (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text2)' }}>No coupons created yet.</div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 24, width: '100%', maxWidth: 500, padding: 32 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 24 }}>New Coupon</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="label">Coupon Code</label>
                <input placeholder="e.g. WELCOME10" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="label">Discount Type</label>
                  <select value={form.discountType} onChange={e => setForm({...form, discountType: e.target.value})}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Amount</label>
                  <input type="number" value={form.discountAmount} onChange={e => setForm({...form, discountAmount: e.target.value})} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="label">Min. Purchase (₹)</label>
                  <input type="number" value={form.minPurchase} onChange={e => setForm({...form, minPurchase: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="label">Usage Limit</label>
                  <input type="number" value={form.usageLimit} onChange={e => setForm({...form, usageLimit: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Expiry Date</label>
                <input type="date" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button className="btn-primary" style={{ flex: 1 }} type="submit">Create Coupon</button>
                <button className="btn-outline" style={{ flex: 1 }} type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
