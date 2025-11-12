function Download() {
  return (
    <section id="download" className="snap-section gradient-bg">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem', width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
            Скачайте приложение
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', maxWidth: '40rem', margin: '0 auto 3rem' }}>
            Начните изучать языки прямо сейчас! Доступно на iOS и Android
          </p>

          <div 
            style={{ 
              display: 'flex', 
              gap: '1.5rem', 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginBottom: '3rem', 
              flexWrap: 'wrap' 
            }}
          >
            <a 
              href="https://apps.apple.com" 
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'flex-start',
                gap: '1rem', 
                background: 'black', 
                color: 'white', 
                padding: '1rem 2rem',
                width: '250px',
                height: '70px',
                borderRadius: '1rem', 
                textDecoration: 'none', 
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', 
                transition: 'transform 0.3s' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img 
                src="../trickle/assets/appstore.png" 
                alt="App Store"
                style={{ width: '2.5rem', height: '2.5rem' }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.75rem' }}>Загрузить в</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>App Store</div>
              </div>
            </a>

            <a 
              href="https://play.google.com" 
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'flex-start',
                gap: '1rem', 
                background: 'black', 
                color: 'white', 
                padding: '1rem 2rem',
                width: '250px',
                height: '70px',
                borderRadius: '1rem', 
                textDecoration: 'none', 
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', 
                transition: 'transform 0.3s' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img 
                src="../trickle/assets/playmarket.png" 
                alt="Google Play"
                style={{ width: '2.5rem', height: '2.5rem' }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.75rem' }}>Загрузить в</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Google Play</div>
              </div>
            </a>
          </div>

          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #E2E8F0' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
              © 2025 LinguaPlay. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
