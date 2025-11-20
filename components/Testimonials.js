function Testimonials() {
  const testimonials = [
    {
      name: 'Анна Петрова',
      role: 'Студентка',
      text: 'Благодаря LinguaPlay я начала свободно говорить по-английски всего за 6 месяцев!',
      rating: 5,
      avatar: '👩‍🎓'
    },
    {
      name: 'Михаил Соколов',
      role: 'Программист',
      text: 'Лучшее приложение для изучения языков! Геймификация действительно мотивирует.',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      name: 'Елена Волкова',
      role: 'Учитель',
      text: 'Рекомендую всем своим ученикам! Методика обучения действительно работает.',
      rating: 5,
      avatar: '👩‍🏫'
    },
    {
      name: 'Дмитрий Иванов',
      role: 'Менеджер',
      text: 'Изучал испанский для работы. За 4 месяца вышел на уровень B1! Невероятно удобно.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Ольга Смирнова',
      role: 'Дизайнер',
      text: 'Милые персонажи и интересные задания делают обучение приятным. Занимаюсь каждый день!',
      rating: 5,
      avatar: '👩‍🎨'
    },
    {
      name: 'Александр Козлов',
      role: 'Предприниматель',
      text: 'Учу корейский для бизнеса. Прогресс виден уже через месяц занятий. Отличное приложение!',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Мария Новикова',
      role: 'Врач',
      text: 'Занимаюсь по 15 минут в день, и этого достаточно! Очень удобная система напоминаний.',
      rating: 5,
      avatar: '👩‍⚕️'
    },
    {
      name: 'Сергей Павлов',
      role: 'Инженер',
      text: 'Начинал с нуля, сейчас уже могу смотреть фильмы на английском. Спасибо LinguaPlay!',
      rating: 5,
      avatar: '👨‍🔧'
    }
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const scroll = (direction) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (direction === 'left' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 3);
    } else if (direction === 'right' && currentIndex < testimonials.length - 3) {
      setCurrentIndex(currentIndex + 3);
    }
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3);

  return (
    <section id="testimonials" className="snap-section gradient-bg">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1rem' }}>
            Что говорят <span style={{ color: 'var(--primary-color)' }}>наши пользователи</span>
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', maxWidth: '40rem', margin: '0 auto' }}>
            Более 10 миллионов человек уже достигли своих языковых целей с нами
          </p>
        </div>
        
        <div style={{ position: 'relative' }}>
          {currentIndex > 0 && (
            <button
              onClick={() => scroll('left')}
              style={{
                position: 'absolute',
                left: '-60px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '0',
                height: '0',
                border: 'none',
                borderTop: '20px solid transparent',
                borderBottom: '20px solid transparent',
                borderRight: '30px solid var(--primary-color)',
                cursor: 'pointer',
                background: 'transparent',
                transition: 'all 0.3s',
                filter: 'drop-shadow(0 4px 8px rgba(96, 165, 250, 0.3))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderRightColor = 'var(--accent-color)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderRightColor = 'var(--primary-color)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            />
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }} className="grid-cols-3">
            {visibleTestimonials.map((testimonial, index) => (
              <div key={currentIndex + index} className="testimonial-card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ 
                    width: '3.5rem', 
                    height: '3.5rem', 
                    background: 'var(--secondary-color)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    marginRight: '1rem'
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                      {testimonial.name}
                    </h4>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} style={{ color: '#FCD34D', fontSize: '1.1rem' }}>★</span>
                  ))}
                </div>
                <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {testimonial.text}
                </p>
              </div>
            ))}
          </div>

          {currentIndex < testimonials.length - 3 && (
            <button
              onClick={() => scroll('right')}
              style={{
                position: 'absolute',
                right: '-60px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '0',
                height: '0',
                border: 'none',
                borderTop: '20px solid transparent',
                borderBottom: '20px solid transparent',
                borderLeft: '30px solid var(--primary-color)',
                cursor: 'pointer',
                background: 'transparent',
                transition: 'all 0.3s',
                filter: 'drop-shadow(0 4px 8px rgba(96, 165, 250, 0.3))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderLeftColor = 'var(--accent-color)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderLeftColor = 'var(--primary-color)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            />
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: Math.floor(currentIndex / 3) === idx ? 'var(--primary-color)' : '#E2E8F0',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;