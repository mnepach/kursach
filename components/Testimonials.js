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
    }
  ];

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
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }} className="grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
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
      </div>
    </section>
  );
}

export default Testimonials;