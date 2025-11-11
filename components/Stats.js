function Stats() {
  const stats = [
    { number: '10M+', label: 'Активных пользователей', icon: '../trickle/assets/users.png' },
    { number: '30+', label: 'Языков доступно', icon: '../trickle/assets/study.png' },
    { number: '500K+', label: 'Уроков пройдено ежедневно', icon: '../trickle/assets/lesson.png' },
    { number: '95%', label: 'Довольных пользователей', icon: '../trickle/assets/smile.png' }
  ];

  return (
    <section id="stats" className="snap-section" style={{ background: 'white' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1rem' }}>
            LinguaPlay в <span style={{ color: 'var(--primary-color)' }}>цифрах</span>
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', maxWidth: '40rem', margin: '0 auto' }}>
            Присоединяйтесь к миллионам людей, изучающих языки с нами
          </p>
        </div>

        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '2rem' 
          }}
          className="grid-cols-4"
        >
          {stats.map((stat, index) => (
            <div key={index} className="card" style={{ textAlign: 'center', position: 'relative' }}>
              <div 
                style={{ 
                  width: '5rem', 
                  height: '5rem',
                  margin: '0 auto 1.5rem',
                  position: 'relative',
                }}
              >
                <img 
                  src={stat.icon} 
                  alt={stat.label} 
                  style={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(1.5)', 
                    width: '5rem',
                    height: '5rem',
                    objectFit: 'contain',
                    pointerEvents: 'none'
                  }}
                />
              </div>
              <div className="stat-number">{stat.number}</div>
              <p style={{ color: 'var(--text-light)', fontSize: '1rem', marginTop: '0.5rem' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
