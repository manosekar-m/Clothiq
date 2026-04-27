import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiMail, FiCheckCircle, FiXCircle, FiClock, FiTrash2 } from 'react-icons/fi';

export default function Queries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const { data } = await api.get('/queries');
      setQueries(data);
    } catch (err) {
      toast.error('Failed to load queries');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/queries/${id}`, { status });
      toast.success(`Marked as ${status}`);
      setQueries(queries.map(q => q._id === id ? { ...q, status } : q));
      if (selectedQuery?._id === id) setSelectedQuery({ ...selectedQuery, status });
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const saveAdminNote = async () => {
    try {
      await api.put(`/queries/${selectedQuery._id}`, { adminNote });
      toast.success('Note saved');
      setQueries(queries.map(q => q._id === selectedQuery._id ? { ...q, adminNote } : q));
      setSelectedQuery({ ...selectedQuery, adminNote });
    } catch (err) {
      toast.error('Failed to save note');
    }
  };

  const deleteQuery = async (id) => {
    if (!window.confirm('Are you sure you want to delete this query?')) return;
    try {
      await api.delete(`/queries/${id}`);
      toast.success('Query deleted');
      setQueries(queries.filter(q => q._id !== id));
      if (selectedQuery?._id === id) setSelectedQuery(null);
    } catch (err) {
      toast.error('Failed to delete query');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new': return <span className="badge" style={{ background: 'rgba(243, 156, 18, 0.15)', color: '#f39c12' }}><FiClock /> New</span>;
      case 'read': return <span className="badge" style={{ background: 'rgba(52, 152, 219, 0.15)', color: '#3498db' }}><FiMail /> Read</span>;
      case 'resolved': return <span className="badge" style={{ background: 'rgba(46, 204, 113, 0.15)', color: '#2ecc71' }}><FiCheckCircle /> Resolved</span>;
      default: return null;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 8 }}>Customer Queries</h2>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Manage and respond to contact form submissions.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left: Query List */}
        <div style={{ background: 'var(--bg2)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>Loading...</div>
          ) : queries.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>No queries found.</div>
          ) : (
            <div>
              {queries.map(q => (
                <div key={q._id} onClick={() => { setSelectedQuery(q); setAdminNote(q.adminNote); if(q.status === 'new') updateStatus(q._id, 'read'); }}
                  style={{
                    padding: 20, borderBottom: '1px solid var(--border)', cursor: 'pointer',
                    background: selectedQuery?._id === q._id ? 'var(--bg3)' : 'transparent',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 600 }}>{q.name}</span>
                      {getStatusBadge(q.status)}
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text2)' }}>
                      {new Date(q.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', marginBottom: 4 }}>{q.subject}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {q.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Query Details */}
        {selectedQuery ? (
          <div style={{ background: 'var(--bg2)', borderRadius: 20, border: '1px solid var(--border)', padding: 32, position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{selectedQuery.subject}</h3>
                <p style={{ fontSize: 13, color: 'var(--text2)' }}>From: <a href={`mailto:${selectedQuery.email}`} style={{ color: 'var(--accent)' }}>{selectedQuery.name} &lt;{selectedQuery.email}&gt;</a></p>
                <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Date: {new Date(selectedQuery.createdAt).toLocaleString('en-IN')}</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {getStatusBadge(selectedQuery.status)}
                <button onClick={() => deleteQuery(selectedQuery._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }} title="Delete Query">
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>

            <div style={{ padding: 20, background: 'var(--bg3)', borderRadius: 12, fontSize: 14, lineHeight: 1.6, marginBottom: 24, border: '1px solid var(--border)' }}>
              {selectedQuery.message}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text2)' }}>Admin Notes (Internal)</label>
              <textarea
                value={adminNote}
                onChange={e => setAdminNote(e.target.value)}
                placeholder="Add notes about resolving this query..."
                rows={4}
                style={{ width: '100%', padding: 12, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 13, resize: 'vertical' }}
              />
              <button onClick={saveAdminNote} className="btn-outline" style={{ marginTop: 10, padding: '8px 16px', fontSize: 12 }}>Save Note</button>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => updateStatus(selectedQuery._id, 'read')} disabled={selectedQuery.status === 'read'} className="btn-outline" style={{ flex: 1, padding: '12px', fontSize: 13, opacity: selectedQuery.status === 'read' ? 0.5 : 1 }}>
                Mark as Read
              </button>
              <button onClick={() => updateStatus(selectedQuery._id, 'resolved')} disabled={selectedQuery.status === 'resolved'} className="btn-primary" style={{ flex: 1, padding: '12px', fontSize: 13, opacity: selectedQuery.status === 'resolved' ? 0.5 : 1 }}>
                Mark Resolved
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: 'var(--bg2)', borderRadius: 20, border: '1px solid var(--border)', padding: 60, textAlign: 'center', color: 'var(--text2)' }}>
            <FiMail size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
            <p>Select a query to view details</p>
          </div>
        )}
      </div>
      <style>{`
        .badge { display: inline-flex; alignItems: center; gap: 4px; padding: 4px 8px; border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        @media(max-width: 900px) { div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
