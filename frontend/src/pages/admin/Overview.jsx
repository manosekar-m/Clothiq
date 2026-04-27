import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { FiShoppingBag, FiUsers, FiBox, FiTrendingUp, FiClock, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Overview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': case 'paid': return '#2ecc71';
      case 'cancelled': case 'failed': return '#e05252';
      case 'shipped': return '#3498db';
      case 'processing': return '#f39c12';
      default: return '#e8c97e';
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, color: 'var(--text2)' }}>
      Loading dashboard...
    </div>
  );

  if (!stats) return (
    <div style={{ color: 'var(--danger)', padding: 40, textAlign: 'center' }}>
      Failed to load dashboard data. Please refresh.
    </div>
  );

  const revenueUp = Number(stats.revenueChange) >= 0;

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      sub: `${revenueUp ? '+' : ''}${stats.revenueChange}% vs last week`,
      subUp: revenueUp,
      icon: <FiTrendingUp />,
      color: '#e8c97e'
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      sub: `${stats.pendingOrders} pending`,
      icon: <FiShoppingBag />,
      color: '#3498db'
    },
    {
      label: 'Products',
      value: stats.activeProducts,
      sub: `${stats.totalProducts} total (incl. inactive)`,
      icon: <FiBox />,
      color: '#9b59b6'
    },
    {
      label: 'Total Customers',
      value: stats.totalUsers,
      icon: <FiUsers />,
      color: '#2ecc71'
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 8 }}>Dashboard Overview</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        {statCards.map((card, idx) => (
          <div key={idx} style={{
            background: 'var(--bg2)', padding: 24, borderRadius: 20,
            border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 18
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: `${card.color}18`, color: card.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ color: 'var(--text2)', fontSize: 12, marginBottom: 4 }}>{card.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{card.value}</div>
              {card.sub && (
                <div style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4,
                  color: card.subUp !== undefined ? (card.subUp ? '#2ecc71' : '#e05252') : 'var(--text2)'
                }}>
                  {card.subUp !== undefined && (card.subUp ? <FiArrowUpRight size={11}/> : <FiArrowDownRight size={11}/>)}
                  {card.sub}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Revenue Chart */}
        <div style={{ background: 'var(--bg2)', padding: 28, borderRadius: 20, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>Revenue — Last 7 Days</h3>
            <span style={{
              fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 100,
              background: revenueUp ? 'rgba(46,204,113,0.1)' : 'rgba(224,82,82,0.1)',
              color: revenueUp ? '#2ecc71' : '#e05252'
            }}>
              {revenueUp ? '+' : ''}{stats.revenueChange}% vs last week
            </span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={stats.chartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="name" stroke="var(--text2)" fontSize={11} tickLine={false} axisLine={false}/>
              <YAxis stroke="var(--text2)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`}/>
              <Tooltip
                contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }}
                formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="sales" stroke="var(--accent)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'var(--bg2)', padding: 28, borderRadius: 20, border: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 20 }}>Quick Actions</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { label: 'Add New Product', icon: <FiBox />, path: '/admin/products' },
              { label: 'Manage Orders', icon: <FiShoppingBag />, path: '/admin/orders', badge: stats.pendingOrders > 0 ? stats.pendingOrders : null },
              { label: 'Customer Insights', icon: <FiUsers />, path: '/admin/users' },
              { label: 'Manage Coupons', icon: <FiTrendingUp />, path: '/admin/coupons' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
                  fontSize: 14, textAlign: 'left', width: '100%', cursor: 'pointer',
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  borderRadius: 12, color: 'var(--text)', transition: 'border-color 0.2s',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: 'var(--accent)' }}>{item.icon}</span>
                  {item.label}
                </div>
                {item.badge && (
                  <span style={{ background: '#e8c97e', color: '#000', borderRadius: 100, fontSize: 11, fontWeight: 700, padding: '2px 8px' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Order Status Breakdown */}
          <div style={{ marginTop: 24, padding: 16, background: 'var(--bg3)', borderRadius: 14, border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase' }}>Order Status</p>
            {Object.entries(stats.statusBreakdown).map(([status, count]) => (
              <div key={status} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: 'var(--text2)', textTransform: 'capitalize' }}>{status}</span>
                <span style={{ fontWeight: 700, color: getStatusColor(status) }}>{count}</span>
              </div>
            ))}
            {Object.keys(stats.statusBreakdown).length === 0 && (
              <p style={{ fontSize: 12, color: 'var(--text2)' }}>No orders yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div style={{ background: 'var(--bg2)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>Recent Orders</h3>
          <button onClick={() => navigate('/admin/orders')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
            View All →
          </button>
        </div>
        {stats.recentOrders.length === 0 ? (
          <div style={{ padding: '40px 28px', textAlign: 'center', color: 'var(--text2)', fontSize: 14 }}>
            No orders yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Order ID', 'Customer', 'Amount', 'Status', 'Payment', 'Date'].map(h => (
                  <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, color: 'var(--text2)', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map(order => (
                <tr key={order._id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 24px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text2)' }}>#{order._id.slice(-6).toUpperCase()}</td>
                  <td style={{ padding: '14px 24px', fontSize: 14, fontWeight: 500 }}>{order.userName}</td>
                  <td style={{ padding: '14px 24px', fontSize: 14, fontWeight: 700 }}>₹{order.totalAmount.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '14px 24px' }}>
                    <span style={{
                      fontSize: 11, padding: '3px 9px', borderRadius: 6,
                      background: `${getStatusColor(order.orderStatus)}18`,
                      color: getStatusColor(order.orderStatus),
                      textTransform: 'capitalize', fontWeight: 600
                    }}>{order.orderStatus}</span>
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    <span style={{
                      fontSize: 11, padding: '3px 9px', borderRadius: 6,
                      background: `${getStatusColor(order.paymentStatus)}18`,
                      color: getStatusColor(order.paymentStatus),
                      textTransform: 'capitalize', fontWeight: 600
                    }}>{order.paymentStatus}</span>
                  </td>
                  <td style={{ padding: '14px 24px', fontSize: 12, color: 'var(--text2)' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
