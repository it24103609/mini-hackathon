import React, { useEffect, useState } from 'react';
import { ArrowRight, Search, ShieldCheck, MapPin, Clock3, Pill, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import './Home.css';

const Home = () => {
  const [medicines, setMedicines] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeaturedMedicines = async () => {
      try {
        const response = await API.get('/medicines');
        if (response.data.success) setMedicines(response.data.medicines.slice(0, 3));
      } catch (error) {
        console.error('Unable to load featured medicines:', error);
      }
    };

    loadFeaturedMedicines();
  }, []);

  const goToDashboard = () => {
    if (!user) return navigate('/login');
    if (user.role === 'pharmacist') return navigate('/pharmacist/dashboard');
    if (user.role === 'admin') return navigate('/admin/orders');
    return navigate('/medicines');
  };

  return (
    <div className="home-page">
      <section className="home-hero">
        <video className="hero-video" autoPlay muted loop playsInline poster="/hero.png">
          <source src="/hero-background.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay" />
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />

        <div className="home-hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> Sri Lanka's smarter medicine finder</div>
          <h1>Find your medicine.<br /><em>Find your way forward.</em></h1>
          <p className="hero-description">
            Search verified medicine availability, compare nearby pharmacies, and save a trip across Sri Lanka.
          </p>
          <div className="hero-actions">
            <Link to="/medicines" className="btn btn-primary hero-button">
              <Search size={18} /> Find a medicine <ArrowRight size={17} />
            </Link>
            <Link to="/register" className="text-link">Join MedFind LK <ArrowRight size={16} /></Link>
          </div>
          <div className="hero-note"><ShieldCheck size={16} /> Live stock updates from registered pharmacies</div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="visual-ring ring-back" />
          <div className="visual-ring ring-front" />
          <div className="medicine-card card-main">
            <div className="card-icon"><Pill size={23} /></div>
            <div><strong>Paracetamol 500mg</strong><span>Available near you</span></div>
            <span className="status-dot" />
          </div>
          <div className="medicine-card card-small">
            <MapPin size={17} /><span><strong>12 pharmacies</strong><small>in Colombo</small></span>
          </div>
          <div className="floating-cross">+</div>
        </div>
      </section>

      <section className="home-stats">
        <div><strong>01</strong><span>Search what you need</span></div>
        <div><strong>02</strong><span>Compare nearby options</span></div>
        <div><strong>03</strong><span>Order with confidence</span></div>
      </section>

      <section className="home-features">
        <div className="section-heading"><span className="section-kicker">Why MedFind LK</span><h2>Healthcare shopping,<br /><span>made less stressful.</span></h2></div>
        <div className="feature-grid">
          <article className="feature-card feature-card-highlight"><div className="feature-number">01</div><Search size={25} /><h3>Search smarter</h3><p>Find the right medicine by name, category, or city in seconds.</p><Link to="/medicines">Explore medicines <ArrowRight size={15} /></Link></article>
          <article className="feature-card"><div className="feature-number">02</div><MapPin size={25} /><h3>Stay nearby</h3><p>See pharmacy locations and choose an option that works for you.</p></article>
          <article className="feature-card"><div className="feature-number">03</div><Clock3 size={25} /><h3>Save your time</h3><p>Check availability before you leave home. No more pharmacy-to-pharmacy searching.</p></article>
        </div>
      </section>

      <section className="home-about">
        <div className="about-visual"><div className="about-symbol"><Pill size={44} /></div><span>MEDFIND<br />LK</span></div>
        <div className="about-copy"><span className="section-kicker">About MedFind LK</span><h2>Less searching.<br /><span>More caring.</span></h2><p>MedFind LK connects patients with registered pharmacies across Sri Lanka. We make medicine availability clear, so you can spend less time travelling from shop to shop and more time taking care of what matters.</p><div className="about-points"><span><ShieldCheck size={16} /> Verified pharmacy listings</span><span><Building2 size={16} /> Local availability information</span></div></div>
      </section>

      <section className="featured-medicines">
        <div className="featured-heading"><div><span className="section-kicker">From the medicine database</span><h2>Popular medicines</h2></div><button className="text-link featured-view-all" onClick={goToDashboard}>{user ? 'Go to dashboard' : 'Login to view more'} <ArrowRight size={16} /></button></div>
        <div className="medicine-preview-grid">
          {medicines.length > 0 ? medicines.map((medicine) => (
            <article className="medicine-preview-card" key={medicine._id}>
              <div className="preview-image">{medicine.imageUrl ? <img src={medicine.imageUrl} alt={medicine.medicineName} /> : <Pill size={42} />}</div>
              <div className="preview-content"><span className="preview-category">{medicine.category}</span><h3>{medicine.medicineName}</h3><p>{medicine.description || 'Medicine availability and pharmacy details.'}</p><div className="preview-meta"><strong>LKR {Number(medicine.price).toLocaleString()}</strong><span className={`preview-status ${medicine.quantity > 0 ? 'is-available' : ''}`}>{medicine.quantity > 0 ? 'Available' : 'Out of stock'}</span></div><button className="btn btn-secondary preview-button" onClick={goToDashboard}>View More <ArrowRight size={15} /></button></div>
            </article>
          )) : <div className="featured-empty">Medicine data will appear here when the backend is connected.</div>}
        </div>
      </section>

      <section className="home-cta">
        <div><span className="section-kicker">Ready when you are</span><h2>Your next pharmacy visit<br />starts <span>here.</span></h2></div>
        <Link to="/medicines" className="btn btn-primary hero-button">Browse medicines <ArrowRight size={17} /></Link>
      </section>
    </div>
  );
};

export default Home;
