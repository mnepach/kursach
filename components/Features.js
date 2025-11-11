function Features() {
  try {
    const features = [
      {
        icon: 'gamepad-2',
        title: 'Геймификация',
        description: 'Зарабатывайте очки, открывайте достижения и соревнуйтесь с друзьями в рейтингах'
      },
      {
        icon: 'brain',
        title: 'Умные уроки',
        description: 'Адаптивная программа обучения подстраивается под ваш уровень и темп'
      },
      {
        icon: 'users',
        title: 'Милые персонажи',
        description: 'Учитесь вместе с Kirby и Cinnamoroll в веселых приключениях'
      },
      {
        icon: 'trophy',
        title: 'Достижения',
        description: 'Отслеживайте свой прогресс и получайте награды за каждый успех'
      },
      {
        icon: 'calendar',
        title: 'Ежедневные цели',
        description: 'Формируйте полезные привычки с ежедневными заданиями и напоминаниями'
      },
      {
        icon: 'globe',
        title: 'Множество языков',
        description: 'Изучайте английский, испанский, французский, немецкий и другие языки'
      }
    ];

    return (
      <section 
        id="features"
        className="snap-section gradient-bg flex items-center justify-center"
        data-name="features"
        data-file="components/Features.js"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-[var(--text-dark)] mb-4">
              Почему выбирают <span className="text-[var(--primary-color)]">LinguaPlay?</span>
            </h2>
            <p className="text-xl text-[var(--text-light)] max-w-2xl mx-auto">
              Все инструменты для эффективного изучения языков в одном приложении
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 bg-[var(--secondary-color)]">
                  <div className={`icon-${feature.icon} text-4xl text-[var(--primary-color)]`}></div>
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-light)] text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Features component error:', error);
    return null;
  }
}