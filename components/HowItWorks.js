function HowItWorks() {
  const steps = [
    { icon: 'user-plus', title: 'Регистрация', description: 'Создайте аккаунт за 30 секунд и выберите свой первый язык' },
    { icon: 'target', title: 'Поставьте цель', description: 'Определите свой уровень и установите ежедневные задачи' },
    { icon: 'gamepad-2', title: 'Играйте и учитесь', description: 'Проходите увлекательные уроки с персонажами Sanrio' },
    { icon: 'trophy', title: 'Отслеживайте прогресс', description: 'Зарабатывайте очки, открывайте достижения и соревнуйтесь' }
  ];

  return (
    <section id="how-it-works" className="snap-section" style={{ background: 'white' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1rem' }}>
            Как это <span style={{ color: 'var(--primary-color)' }}>работает?</span>
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', maxWidth: '40rem', margin: '0 auto' }}>
            Начните свое языковое путешествие всего за 4 простых шага
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }} className="grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="card" style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '5rem', 
                height: '5rem', 
                background: 'var(--secondary-color)', 
                borderRadius: '1.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <i className={`lucide-${step.icon}`} style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
              </div>
              <div style={{ 
                width: '2rem', 
                height: '2rem', 
                background: 'var(--primary-color)', 
                color: 'white', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontWeight: 'bold'
              }}>{index + 1}</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                {step.title}
              </h3>
              <p style={{ color: 'var(--text-light)', fontSize: '1rem', lineHeight: '1.5' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}