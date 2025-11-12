function Header({ onAuthClick, isLoggedIn }) {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
          <div 
            className="logo-container"
            onClick={() => scrollToSection('hero')} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <div style={{ 
              width: '2.5rem', 
              height: '2.5rem', 
              background: 'var(--primary-color)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <i className="lucide-sparkles" style={{ color: 'white', fontSize: '1.5rem' }}></i>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>LinguaPlay</span>
          </div>
          
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <button onClick={() => scrollToSection('hero')} style={{ background: 'none', border: 'none', color: 'var(--text-dark)', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}>Главная</button>
            <button onClick={() => scrollToSection('how-it-works')} style={{ background: 'none', border: 'none', color: 'var(--text-dark)', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}>Как работает</button>
            <button onClick={() => scrollToSection('features')} style={{ background: 'none', border: 'none', color: 'var(--text-dark)', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}>Возможности</button>
            <button onClick={() => scrollToSection('languages')} style={{ background: 'none', border: 'none', color: 'var(--text-dark)', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}>Языки</button>
            <button onClick={() => scrollToSection('testimonials')} style={{ background: 'none', border: 'none', color: 'var(--text-dark)', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}>Отзывы</button>
            <button onClick={onAuthClick} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              {isLoggedIn ? 'Личный кабинет' : 'Войти'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}