function Features() {
  const features = [
    { icon: 'gamepad-2', title: 'Геймификация', description: 'Зарабатывайте очки, открывайте достижения и соревнуйтесь с друзьями в рейтингах' },
    { icon: 'brain', title: 'Умные уроки', description: 'Адаптивная программа обучения подстраивается под ваш уровень и темп' },
    { icon: 'users', title: 'Милые персонажи', description: 'Учитесь вместе с Kirby, Cinnamoroll и другими героями Sanrio' },
    { icon: 'trophy', title: 'Достижения', description: 'Отслеживайте свой прогресс и получайте награды за каждый успех' },
    { icon: 'calendar', title: 'Ежедневные цели', description: 'Формируйте полезные привычки с ежедневными заданиями и напоминаниями' },
    { icon: 'globe', title: 'Множество языков', description: 'Изучайте английский, испанский, французский, немецкий и другие языки' }
  ];

  return (
    <section id="features" className="snap-section gradient-bg">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1rem' }}>
            Почему выбирают <span style={{ color: 'var(--primary-color)' }}>LinguaPlay?</span>
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', maxWidth: '40rem', margin: '0 auto' }}>
            Все инструменты для эффективного изучения языков в одном приложении
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }} className="grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="card">
              <div style={{ 
                width: '5rem', 
                height: '5rem', 
                background: 'var(--secondary-color)', 
                borderRadius: '1.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <i className={`lucide-${feature.icon}`} style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}></i>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--text-light)', fontSize: '1rem', lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}