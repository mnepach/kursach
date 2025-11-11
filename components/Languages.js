function Languages() {
  try {
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

    return (
      <section 
        id="languages"
        className="snap-section bg-white flex items-center justify-center"
        data-name="languages"
        data-file="components/Languages.js"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-[var(--text-dark)] mb-4">
              Изучайте <span className="text-[var(--primary-color)]">любой</span> язык
            </h2>
            <p className="text-xl text-[var(--text-light)] max-w-2xl mx-auto">
              Более 30 языковых курсов доступно прямо сейчас
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {languages.map((lang, index) => (
              <div key={index} className="card text-center hover:bg-[var(--secondary-color)] cursor-pointer">
                <div className="text-6xl mb-4">{lang.flag}</div>
                <h3 className="text-xl font-bold text-[var(--text-dark)] mb-2">
                  {lang.name}
                </h3>
                <p className="text-[var(--text-light)]">
                  {lang.learners} учеников
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Languages component error:', error);
    return null;
  }
}