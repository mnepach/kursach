function Features() {
  const features = [
    { icon: 'gamepad-2', title: 'Геймификация', description: 'Зарабатывайте очки, открывайте достижения и соревнуйтесь с друзьями' },
    { icon: 'brain', title: 'Умные уроки', description: 'Адаптивная программа обучения подстраивается под ваш уровень' },
    { icon: 'users', title: 'Милые персонажи', description: 'Учитесь вместе с героями Sanrio' },
    { icon: 'trophy', title: 'Достижения', description: 'Отслеживайте прогресс и получайте награды' },
    { icon: 'calendar', title: 'Ежедневные цели', description: 'Формируйте привычки с заданиями' },
    { icon: 'globe', title: 'Множество языков', description: 'Изучайте английский, испанский и другие' }
  ];

  return (
    <section id="features" className="snap-section gradient-bg">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
            Почему выбирают <span style={{ color: 'var(--primary-color)' }}>LinguaPlay?</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', maxWidth: '40rem', margin: '0 auto' }}>
            Все инструменты для эффективного изучения языков
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ 
                width: '4rem', 
                height: '4rem', 
                background: 'var(--secondary-color)', 
                borderRadius: '1rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <i className={`lucide-${feature.icon}`} style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}