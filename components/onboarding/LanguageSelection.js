function LanguageSelection({ onNext }) {
  const [selectedLanguage, setSelectedLanguage] = React.useState(null);

  const languages = [
    { name: 'Английский', flag: '../trickle/assets/england.png', learners: '5M+' },
    { name: 'Испанский', flag: '../trickle/assets/spain.png', learners: '3M+' },
    { name: 'Французский', flag: '../trickle/assets/france.png', learners: '2M+' },
    { name: 'Немецкий', flag: '../trickle/assets/germany.png', learners: '1.5M+' },
    { name: 'Итальянский', flag: '../trickle/assets/italy.png', learners: '1M+' },
    { name: 'Японский', flag: '../trickle/assets/japan.png', learners: '2M+' },
    { name: 'Корейский', flag: '../trickle/assets/korea.png', learners: '1.5M+' },
    { name: 'Китайский', flag: '../trickle/assets/china.png', learners: '1M+' }
  ];

  const handleSelect = (language) => {
    setSelectedLanguage(language);
    setTimeout(() => {
      onNext({ selectedLanguage: language });
    }, 300);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-[var(--text-dark)] mb-12">
          Я хочу изучать...
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {languages.map((lang, index) => (
            <div
              key={index}
              onClick={() => handleSelect(lang)}
              className={`card language-card text-center cursor-pointer transition-all duration-300 ${
                selectedLanguage?.name === lang.name ? 'ring-4 ring-[var(--primary-color)]' : ''
              }`}
              style={{
                transition: 'transform 0.3s ease',
                transformStyle: 'preserve-3d',
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
              <h3 className="text-xl font-bold text-[var(--text-dark)] mb-2">
                {lang.name}
              </h3>
              <p className="text-sm text-[var(--text-light)]">
                {lang.learners} учеников
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}