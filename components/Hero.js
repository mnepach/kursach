function Hero({ onGetStarted }) {
  try {
    return (
      <section 
        id="hero"
        className="snap-section flex items-center justify-center pt-16 relative overflow-hidden"
        data-name="hero"
        data-file="components/Hero.js"
        style={{
          background: 'linear-gradient(135deg, #E0F2FE 0%, #FFFFFF 50%, #F3E8FF 100%)'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(../trickle/assets/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.7,
            zIndex: 0
          }}
        ></div>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '15vh',
            background: 'linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0) 100%)',
            zIndex: 1
          }}
        ></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
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
                <button 
                  onClick={() => document.getElementById('download').scrollIntoView({ behavior: 'smooth' })} 
                  className="btn-secondary"
                >
                  Скачать приложение
                </button>
              </div>
            </div>

            <div className="relative flex justify-center items-center">
              <div className="z-10">
                <img 
                  src="../trickle/assets/kitty.png" 
                  alt="Kitty character"
                  className="w-80 h-auto mx-auto drop-shadow-2xl floating"
                />
              </div>
              <div 
                className="absolute z-20" 
                style={{
                  transform: 'translate(130px, 100px)'
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

export default Hero;
