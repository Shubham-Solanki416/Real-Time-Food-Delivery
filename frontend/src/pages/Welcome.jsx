import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Navigation, Clock, ShieldCheck, ChevronRight, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="welcome-page" style={styles.container}>
      {/* Background Decor */}
      <div style={styles.circle1}></div>
      <div style={styles.circle2}></div>

      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={styles.nav}
      >
        <div style={styles.logo}>Food Express</div>
        <div style={styles.navLinks}>
          <button onClick={() => navigate('/login')} style={styles.loginBtn}>Login</button>
          <button onClick={() => navigate('/signup')} style={styles.signupBtn}>Join Now</button>
        </div>
      </motion.nav>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={styles.main}
      >
        <div style={styles.heroSection}>
          <motion.div variants={itemVariants} style={styles.badge}>
            <span style={styles.badgeText}>#1 Food Delivery Service</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} style={styles.headline}>
            Delicious Food, <br />
            <span style={styles.highlight}>Delivered to You.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} style={styles.subheadline}>
            Experience the fastest delivery from your favorite local restaurants. 
            Fresh, hot, and right at your doorstep.
          </motion.p>

          <motion.div variants={itemVariants} style={styles.ctaGroup}>
            <button onClick={() => navigate('/signup')} style={styles.mainCta}>
              Get Started <ChevronRight size={20} />
            </button>
            <button onClick={() => navigate('/home')} style={styles.secondaryCta}>
              Browse as Guest
            </button>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={{...styles.iconWrapper, background: 'rgba(255, 75, 43, 0.1)'}}>
              <Navigation color="#ff4b2b" size={24} />
            </div>
            <h3>Real-time Tracking</h3>
            <p>Know exactly where your order is with our live GPS tracking system.</p>
          </div>

          <div style={styles.featureCard}>
            <div style={{...styles.iconWrapper, background: 'rgba(52, 168, 83, 0.1)'}}>
              <Utensils color="#34a853" size={24} />
            </div>
            <h3>Best Selection</h3>
            <p>Choose from hundreds of premium restaurants and local favorites.</p>
          </div>

          <div style={styles.featureCard}>
            <div style={{...styles.iconWrapper, background: 'rgba(66, 133, 244, 0.1)'}}>
              <Clock color="#4285f4" size={24} />
            </div>
            <h3>Fast Delivery</h3>
            <p>Our fleet of riders ensures your food arrives hot and fresh, always.</p>
          </div>
        </motion.div>
      </motion.main>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={styles.footer}
      >
        <p>&copy; 2026 Food Express. Created with ❤️ for Foodies.</p>
      </motion.footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#ffffff',
    color: '#2d3436',
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  circle1: {
    position: 'absolute',
    top: '-10%',
    right: '-5%',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 75, 43, 0.05) 0%, rgba(255, 75, 43, 0) 70%)',
    zIndex: 0,
  },
  circle2: {
    position: 'absolute',
    bottom: '-20%',
    left: '-10%',
    width: '800px',
    height: '800px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 65, 108, 0.03) 0%, rgba(255, 65, 108, 0) 70%)',
    zIndex: 0,
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 80px',
    zIndex: 10,
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 800,
    background: 'linear-gradient(to right, #ff4b2b, #ff416c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  loginBtn: {
    background: 'transparent',
    border: 'none',
    color: '#2d3436',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    padding: '10px 20px',
  },
  signupBtn: {
    background: '#2d3436',
    color: '#fff',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 80px',
    zIndex: 1,
    textAlign: 'center',
  },
  heroSection: {
    maxWidth: '800px',
    marginBottom: '80px',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(255, 75, 43, 0.1)',
    padding: '8px 16px',
    borderRadius: '30px',
    marginBottom: '24px',
  },
  badgeText: {
    color: '#ff4b2b',
    fontSize: '0.9rem',
    fontWeight: 700,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  headline: {
    fontSize: '4.5rem',
    fontWeight: 900,
    lineHeight: 1.1,
    margin: '0 0 24px 0',
    color: '#1a1a1a',
  },
  highlight: {
    color: '#ff4b2b',
  },
  subheadline: {
    fontSize: '1.25rem',
    color: '#636e72',
    lineHeight: 1.6,
    marginBottom: '40px',
    maxWidth: '600px',
    margin: '0 auto 40px auto',
  },
  ctaGroup: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
  },
  mainCta: {
    background: '#ff4b2b',
    color: '#fff',
    border: 'none',
    padding: '18px 36px',
    borderRadius: '16px',
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 10px 20px rgba(255, 75, 43, 0.2)',
    transition: 'transform 0.3s',
  },
  secondaryCta: {
    background: '#f8fafd',
    color: '#2d3436',
    border: '1px solid #e1e8ed',
    padding: '18px 36px',
    borderRadius: '16px',
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '40px',
    maxWidth: '1100px',
    width: '100%',
  },
  featureCard: {
    padding: '40px',
    background: '#fff',
    borderRadius: '24px',
    textAlign: 'left',
    border: '1px solid #f1f3f5',
    transition: 'all 0.3s',
  },
  iconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  footer: {
    padding: '40px',
    textAlign: 'center',
    color: '#b2bec3',
    fontSize: '0.9rem',
    zIndex: 10,
  },
};

export default Welcome;
