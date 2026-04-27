export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '40px 0 24px', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
          
          {/* Brand */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--accent)', marginBottom: 12 }}>
              Clothiq
            </h3>
            <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.7 }}>
              Premium quality clothing crafted for everyday style and comfort.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="/" style={{ color: 'var(--text2)', fontSize: 13 }}>Home</a>
              <a href="/about" style={{ color: 'var(--text2)', fontSize: 13 }}>About</a>
              <a href="/cart" style={{ color: 'var(--text2)', fontSize: 13 }}>Cart</a>
              <a href="/refund-policy" style={{ color: 'var(--text2)', fontSize: 13 }}>Refund Policy</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
              Contact
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              
              {/* Email */}
              <a
                href="mailto:support@clothiq.in"
                style={{ color: 'var(--text2)', fontSize: 13, textDecoration: 'none' }}
              >
                support@clothiq.in
              </a>

              {/* Phone */}
              <a
                href="tel:+916379833844"
                style={{ color: 'var(--text2)', fontSize: 13, textDecoration: 'none' }}
              >
                +91 63798 33844
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/yourusername" // replace later
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text2)', fontSize: 13, textDecoration: 'none' }}
              >
                Instagram
              </a>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, textAlign: 'center', color: 'var(--text2)', fontSize: 12 }}>
          © {new Date().getFullYear()} Clothiq. All rights reserved.
        </div>
      </div>
    </footer>
  );
}