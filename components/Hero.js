function Hero({ onGetStarted }) {
  try {
    return (
      <section 
        id="hero"
        className="snap-section gradient-bg flex items-center justify-center pt-16"
        data-name="hero"
        data-file="components/Hero.js"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-dark)] mb-6">
                Учите языки<br />
                <span className="text-[var(--primary-color)]">играючи!</span>
              </h1>
              <p className="text-xl text-[var(--text-light)] mb-8">
                Превратите изучение языков в увлекательное приключение с милыми персонажами и интересными заданиями
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button onClick={onGetStarted} className="btn-primary">
                  Начать обучение
                </button>
                <button onClick={() => document.getElementById('download').scrollIntoView({ behavior: 'smooth' })} className="btn-secondary">
                  Скачать приложение
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="floating">
                <img 
                  src="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=400&fit=crop" 
                  alt="Kirby character"
                  className="w-64 h-64 mx-auto rounded-full object-cover shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 floating" style={{ animationDelay: '1s' }}>
                <img 
                  src="https://images.unsplash.com/photo-1603481546506-d0630a0ecf9f?w=200&h=200&fit=crop" 
                  alt="Cinnamoroll character"
                  className="w-32 h-32 rounded-full object-cover shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Hero component error:', error);
    return null;
  }
}