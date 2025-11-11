function Languages() {
  const languages = [
    { name: 'Английский', flag: '🇬🇧', learners: '5M+', level: 'A1-C2' },
    { name: 'Испанский', flag: '🇪🇸', learners: '3M+', level: 'A1-C2' },
    { name: 'Французский', flag: '🇫🇷', learners: '2M+', level: 'A1-C1' },
    { name: 'Немецкий', flag: '🇩🇪', learners: '1.5M+', level: 'A1-C1' },
    { name: 'Итальянский', flag: '🇮🇹', learners: '1M+', level: 'A1-B2' },
    { name: 'Японский', flag: '🇯🇵', learners: '2M+', level: 'A1-B2' },
    { name: 'Корейский', flag: '🇰🇷', learners: '1.5M+', level: 'A1-B2' },
    { name: 'Китайский', flag: '🇨🇳', learners: '1M+', level: 'A1-B1' }
  ];

  return (
    <section id="languages" className="snap-section" style={{ background: 'white' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1rem' }}>
            Изучайте <span style={{ color: 'var(--primary-color)' }}>любой</span> язык
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', maxWidth: '40rem', margin: '0 auto' }}>
            Более 30 языковых курсов доступно прямо сейчас
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }} className="grid-cols-4">
          {languages.map((lang, index) => (
            <div key={index} className="card language-card" style={{ textAlign: 'center', cursor: 'pointer' }}>
              <div className="language-flag">{lang.flag}</div>
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