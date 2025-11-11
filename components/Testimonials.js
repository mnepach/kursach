function Testimonials() {
  const testimonials = [
    {
      name: 'Анна Петрова',
      role: 'Студентка',
      text: 'Благодаря LinguaPlay я начала свободно говорить по-английски всего за 6 месяцев! Уроки настолько увлекательные, что я занимаюсь каждый день.',
      rating: 5,
      avatar: '👩‍🎓'
    },
    {
      name: 'Михаил Соколов',
      role: 'Программист',
      text: 'Лучшее приложение для изучения языков! Геймификация действительно мотивирует продолжать обучение. Уже выучил испанский и начал французский.',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      name: 'Елена Волкова',
      role: 'Учитель',
      text: 'Рекомендую всем своим ученикам! Методика обучения действительно работает, а персонажи Sanrio делают процесс невероятно милым и приятным.',
      rating: 5,
      avatar: '👩‍🏫'
    },
    {
      name: 'Дмитрий Новиков',
      role: 'Бизнесмен',
      text: 'За 3 месяца поднял свой английский с B1 до B2. Идеально для занятых людей - можно заниматься даже 10 минут в день и видеть прогресс.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Ольга Смирнова',
      role: 'Дизайнер',
      text: 'Красивый интерфейс, продуманная система наград и очаровательные персонажи. Изучение японского превратилось в мое любимое хобби!',
      rating: 5,
      avatar: '👩‍🎨'
    },
    {
      name: 'Александр Козлов',
      role: 'Маркетолог',
      text: 'Перепробовал много приложений, но только LinguaPlay смог удержать мое внимание. Ежедневные задания и соревнования с друзьями - это то что нужно!',
      rating: 5,
      avatar: '👨‍💼'
    }
  ];

  return (
    <section id="testimonials" className="snap-section gradient-bg">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1rem' }}>
            Что говорят <span style={{ color: 'var(--primary-color)' }}>наши пользователи</span>
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', maxWidth: '40rem', margin: '0 auto' }}>
            Более 10 миллионов человек уже достигли своих языковых целей с нами
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }} className="grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '4rem', 
                  height: '4rem', 
                  background: 'var(--secondary-color)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '2rem',
                  marginRight: '1rem'
                }}>
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    {testimonial.name}
                  </h4>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} style={{ color: '#FCD34D', fontSize: '1.25rem' }}>★</span>
                ))}
              </div>
              <p style={{ color: 'var(--text-light)', fontSize: '1rem', lineHeight: '1.6' }}>
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}