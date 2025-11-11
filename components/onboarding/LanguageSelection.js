function LanguageSelection({ onNext }) {
  const [selectedLanguage, setSelectedLanguage] = React.useState(null);

  const languages = [
    { name: 'Английский', flag: '🇬🇧', learners: '5M+' },
    { name: 'Испанский', flag: '🇪🇸', learners: '3M+' },
    { name: 'Французский', flag: '🇫🇷', learners: '2M+' },
    { name: 'Немецкий', flag: '🇩🇪', learners: '1.5M+' },
    { name: 'Итальянский', flag: '🇮🇹', learners: '1M+' },
    { name: 'Японский', flag: '🇯🇵', learners: '2M+' },
    { name: 'Корейский', flag: '🇰🇷', learners: '1.5M+' },
    { name: 'Китайский', flag: '🇨🇳', learners: '1M+' }
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
            <button
              key={index}
              onClick={() => handleSelect(lang)}
              className={`card text-center cursor-pointer transition-all ${
                selectedLanguage?.name === lang.name ? 'ring-4 ring-[var(--primary-color)]' : ''
              }`}
            >
              <div className="text-6xl mb-4">{lang.flag}</div>
              <h3 className="text-xl font-bold text-[var(--text-dark)] mb-2">
                {lang.name}
              </h3>
              <p className="text-sm text-[var(--text-light)]">
                {lang.learners} учеников
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}