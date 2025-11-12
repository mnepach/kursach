function Features() {
  const features = [
    { imageSrc: '../trickle/assets/bubble.png', title: 'Геймификация', description: 'Зарабатывайте очки, открывайте достижения и соревнуйтесь с друзьями' },
    { imageSrc: '../trickle/assets/books.png', title: 'Умные уроки', description: 'Адаптивная программа обучения подстраивается под ваш уровень' },
    { imageSrc: '../trickle/assets/cutedog.png', title: 'Милые персонажи', description: 'Учитесь вместе с героями Sanrio' },
    { imageSrc: '../trickle/assets/achieve.png', title: 'Достижения', description: 'Отслеживайте прогресс и получайте награды' }, 
    { imageSrc: '../trickle/assets/star.png', title: 'Ежедневные цели', description: 'Формируйте привычки с заданиями' },
    { imageSrc: '../trickle/assets/study1.png', title: 'Множество языков', description: 'Изучайте английский, испанский и другие' }
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
            <div 
              key={index} 
              className="card" 
              style={{ 
                padding: '1.5rem', 
                textAlign: 'left'
              }}
            >
              
              <div 
                style={{ 
                  width: '7rem', 
                  height: '7rem', 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img 
                  src={feature.imageSrc} 
                  alt={feature.title} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                  }}
                />
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