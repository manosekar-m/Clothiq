export default function SizeChart({ onClose }) {
  const sizes = [
    { size: 'S', chest: '36"', length: '27"', shoulder: '16"' },
    { size: 'M', chest: '38"', length: '28"', shoulder: '17"' },
    { size: 'L', chest: '40"', length: '29"', shoulder: '18"' },
    { size: 'XL', chest: '42"', length: '30"', shoulder: '19"' },
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, maxWidth: 480, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>Size Chart</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: 28, lineHeight: 1 }}>×</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ background: 'var(--surface)' }}>
            {['Size', 'Chest', 'Length', 'Shoulder'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--text2)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {sizes.map((s, i) => (
              <tr key={s.size} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--accent)' }}>{s.size}</td>
                <td style={{ padding: '10px 14px', color: 'var(--text2)' }}>{s.chest}</td>
                <td style={{ padding: '10px 14px', color: 'var(--text2)' }}>{s.length}</td>
                <td style={{ padding: '10px 14px', color: 'var(--text2)' }}>{s.shoulder}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text2)' }}>* All measurements are in inches.</p>
      </div>
    </div>
  );
}
