function Header({ onAuthClick, isLoggedIn }) {
  const [hoveredItem, setHoveredItem] = React.useState(null);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navButtonStyle = (itemName) => ({
    background: 'none',
    border: 'none',
    color: hoveredItem === itemName ? 'var(--primary-color)' : 'var(--text-dark)',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    textDecoration: hoveredItem === itemName ? 'underline' : 'none',
    transition: 'all 0.3s ease'
  });

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
            <button 
              onClick={() => scrollToSection('hero')} 
              onMouseEnter={() => setHoveredItem('hero')}
              onMouseLeave={() => setHoveredItem(null)}
              style={navButtonStyle('hero')}
            >
              Главная
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              onMouseEnter={() => setHoveredItem('how-it-works')}
              onMouseLeave={() => setHoveredItem(null)}
              style={navButtonStyle('how-it-works')}
            >
              Как работает
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              onMouseEnter={() => setHoveredItem('features')}
              onMouseLeave={() => setHoveredItem(null)}
              style={navButtonStyle('features')}
            >
              Возможности
            </button>
            <button 
              onClick={() => scrollToSection('languages')} 
              onMouseEnter={() => setHoveredItem('languages')}
              onMouseLeave={() => setHoveredItem(null)}
              style={navButtonStyle('languages')}
            >
              Языки
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')} 
              onMouseEnter={() => setHoveredItem('testimonials')}
              onMouseLeave={() => setHoveredItem(null)}
              style={navButtonStyle('testimonials')}
            >
              Отзывы
            </button>
            <button onClick={onAuthClick} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              {isLoggedIn ? 'Личный кабинет' : 'Войти'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}