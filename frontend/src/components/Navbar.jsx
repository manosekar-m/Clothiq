import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiHeart } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <span className="logo-text">Clothiq</span>
            <div className="logo-glow"></div>
          </Link>

          {/* Desktop Links */}
          <div className="desktop-nav">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Shop</Link>
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
            <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
          </div>

          {/* Right Section */}
          <div className="nav-actions">
            <Link to="/cart" className="cart-icon-wrapper">
              <FiShoppingCart size={22} className="cart-icon" />
              {cartCount > 0 && (
                <span className="cart-badge bounce-in">{cartCount}</span>
              )}
            </Link>

            {user ? (
              <div className="user-actions">
                {user.role === 'admin' && (
                  <Link to="/admin" className="admin-link">Admin</Link>
                )}
                <Link to="/wishlist" className="profile-icon">
                  <FiHeart size={18} />
                </Link>
                <Link to="/profile" className="profile-icon">
                  <FiUser size={20} />
                </Link>
                <button onClick={handleLogout} className="logout-btn" title="Logout">
                  <FiLogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login"><button className="btn-outline login-btn">Login</button></Link>
                <Link to="/register"><button className="btn-primary signup-btn">Sign Up</button></Link>
              </div>
            )}
            
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <Link to="/" onClick={() => setMenuOpen(false)} className="mobile-link">Shop</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="mobile-link">About</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="mobile-link">Contact</Link>
            {user ? (
              <>
                <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="mobile-link">Wishlist</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="mobile-link">Profile</Link>
                {user.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)} className="mobile-link admin">Admin Panel</Link>}
                <button onClick={handleLogout} className="mobile-logout">
                  <FiLogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <div className="mobile-auth">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline mobile-btn">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary mobile-btn">Register</Link>
              </div>
            )}
          </div>
        </div>

        {/* Premium Ticker Strip */}
        <div className="nav-ticker">
          <div className="nav-ticker-track">
            <span>{'CLOTHIQ X '.repeat(30)}</span>
            <span>{'CLOTHIQ X '.repeat(30)}</span>
          </div>
        </div>
      </nav>

      <style>{`
        /* Navbar Base */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(14, 14, 14, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .navbar.scrolled {
          background: rgba(14, 14, 14, 0.85);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.8);
          border-bottom: 1px solid rgba(232, 201, 126, 0.1);
        }

        /* Nav Ticker */
        .nav-ticker {
          width: 100%;
          background: var(--accent);
          color: #000;
          overflow: hidden;
          padding: 8px 0;
          border-top: 1px solid rgba(0,0,0,0.1);
        }

        .nav-ticker-track {
          display: flex;
          width: max-content;
          animation: navTickerSlide 60s linear infinite;
        }

        .nav-ticker-track span {
          white-space: pre;
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 5px;
        }

        @keyframes navTickerSlide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          transition: height 0.4s;
        }
        .navbar.scrolled .nav-container {
          height: 64px;
        }

        /* Logo Animation */
        .nav-logo {
          position: relative;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }
        .logo-text {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          color: var(--accent);
          letter-spacing: 1px;
          transition: transform 0.3s ease, text-shadow 0.3s ease;
          position: relative;
          z-index: 2;
        }
        .nav-logo:hover .logo-text {
          transform: scale(1.03);
          text-shadow: 0 0 15px rgba(232, 201, 126, 0.4);
        }
        .logo-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          background: var(--accent);
          border-radius: 50%;
          filter: blur(15px);
          opacity: 0;
          transition: all 0.4s ease;
          z-index: 1;
        }
        .nav-logo:hover .logo-glow {
          width: 40px;
          height: 40px;
          opacity: 0.2;
        }

        /* Desktop Nav Links */
        .desktop-nav {
          display: flex;
          gap: 36px;
          align-items: center;
        }
        .nav-link {
          position: relative;
          font-size: 14px;
          color: var(--text2);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: color 0.3s ease;
          padding: 8px 0;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--text);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: var(--accent);
          border-radius: 2px;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after, .nav-link.active::after {
          width: 100%;
        }

        /* Right Section */
        .nav-actions {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        /* Cart Icon */
        .cart-icon-wrapper {
          position: relative;
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: transparent;
          transition: all 0.3s ease;
        }
        .cart-icon-wrapper:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
        }
        .cart-icon {
          transition: transform 0.3s ease;
        }
        .cart-icon-wrapper:hover .cart-icon {
          transform: scale(1.1) rotate(-5deg);
        }
        .cart-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: var(--accent);
          color: #000;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(232, 201, 126, 0.5);
        }
        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .bounce-in {
          animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        /* User Actions */
        .user-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .admin-link {
          font-size: 12px;
          color: var(--accent);
          font-weight: 600;
          border: 1px solid rgba(232, 201, 126, 0.3);
          padding: 4px 10px;
          border-radius: 12px;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .admin-link:hover {
          background: rgba(232, 201, 126, 0.1);
          border-color: var(--accent);
        }
        .profile-icon {
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        .profile-icon:hover {
          background: var(--accent);
          color: #000;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(232, 201, 126, 0.3);
        }
        .logout-btn {
          background: transparent;
          border: none;
          color: var(--text2);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .logout-btn:hover {
          color: var(--danger);
          background: rgba(224, 82, 82, 0.1);
          transform: rotate(5deg);
        }

        /* Auth Buttons */
        .auth-buttons {
          display: flex;
          gap: 12px;
        }
        .login-btn {
          padding: 8px 18px;
          font-size: 13px;
          transition: all 0.3s ease;
        }
        .signup-btn {
          padding: 8px 18px;
          font-size: 13px;
          box-shadow: 0 4px 15px rgba(232, 201, 126, 0.15);
          transition: all 0.3s ease;
        }
        .signup-btn:hover {
          box-shadow: 0 6px 20px rgba(232, 201, 126, 0.3);
        }

        /* Hamburger */
        .hamburger {
          background: none;
          border: none;
          color: var(--text);
          display: none;
          cursor: pointer;
          transition: transform 0.3s ease;
          z-index: 1001;
          position: relative;
        }
        .hamburger:hover {
          color: var(--accent);
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(14, 14, 14, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(-20px);
        }
        .mobile-menu.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .mobile-menu-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          width: 100%;
          padding: 0 20px;
        }
        .mobile-link {
          font-size: 24px;
          font-family: var(--font-display);
          font-weight: 600;
          color: var(--text);
          position: relative;
          overflow: hidden;
        }
        .mobile-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--accent);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }
        .mobile-link:hover::after {
          transform: translateX(0);
        }
        .mobile-link.admin {
          color: var(--accent);
        }
        .mobile-logout {
          background: none;
          border: none;
          color: var(--danger);
          font-size: 18px;
          font-weight: 500;
          font-family: var(--font-body);
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
          transition: all 0.3s ease;
        }
        .mobile-logout:hover {
          transform: scale(1.05);
        }
        .mobile-auth {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          max-width: 250px;
          margin-top: 20px;
        }
        .mobile-btn {
          width: 100%;
          text-align: center;
          padding: 14px;
          font-size: 16px;
        }

        /* Responsive Visibility */
        @media(max-width: 768px) {
          .desktop-nav { display: none !important; }
          .auth-buttons { display: none !important; }
          .user-actions { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </>
  );
}
