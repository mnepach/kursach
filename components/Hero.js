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
            
            {/* Текст */}
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
                <button 
                  onClick={() => document.getElementById('download').scrollIntoView({ behavior: 'smooth' })} 
                  className="btn-secondary"
                >
                  Скачать приложение
                </button>
              </div>
            </div>
            
            {/* Изображения */}
            <div className="relative flex justify-center items-center">
              
              {/* Kitty */}
              <div className="z-10">
                <img 
                  src="../trickle/assets/kitty.png" 
                  alt="Kitty character"
                  className="w-80 h-auto mx-auto drop-shadow-2xl floating"
                />
              </div>

              {/* Cinnamoroll */}
              <div 
                className="absolute z-20" 
                style={{
                  transform: 'translate(130px, 100px)' // стабильное положение
                }}
              >
                <img 
                  src="../trickle/assets/cinamonroll.png" 
                  alt="Cinnamoroll character"
                  className="w-64 h-auto drop-shadow-2xl floating"
                  style={{ animationDelay: '0.8s' }}
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
