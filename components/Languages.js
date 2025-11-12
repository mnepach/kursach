function Languages() {
  const languages = [
    { name: 'Английский', flag: '../trickle/assets/england.png', learners: '5M+', level: 'A1-C2' },
    { name: 'Испанский', flag: '../trickle/assets/spain.png', learners: '3M+', level: 'A1-C2' },
    { name: 'Японский', flag: '../trickle/assets/japan.png', learners: '2M+', level: 'A1-B2' },
    { name: 'Корейский', flag: '../trickle/assets/korea.png', learners: '1.5M+', level: 'A1-B2' }
  ];

  return (
    <section id="languages" className="snap-section" style={{ background: 'white' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.1rem' }}>
            Изучайте <span style={{ color: 'var(--primary-color)' }}>любой</span> язык
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', maxWidth: '40rem', margin: '0 auto' }}>
            Более 30 языковых курсов доступно прямо сейчас
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }} className="grid-cols-4">
          {languages.map((lang, index) => (
            <div
              key={index}
              className="card language-card"
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotateX(10deg) rotateY(10deg)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg)')}
            >
              <div className="language-flag" style={{ marginBottom: '1rem' }}>
                <img
                  src={lang.flag}
                  alt={lang.name}
                  style={{ width: '100px', height: '100px', objectFit: 'contain', margin: '0 auto', display: 'block' }}
                />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                {lang.name}
              </h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {lang.learners} учеников
              </p>
              <p style={{ color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: 'bold' }}>
                Уровни: {lang.level}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Languages; 