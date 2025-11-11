function Download() {
  try {
    return (
      <section 
        id="download"
        className="snap-section gradient-bg flex items-center justify-center"
        data-name="download"
        data-file="components/Download.js"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-dark)] mb-6">
              Скачайте приложение
            </h2>
            <p className="text-xl text-[var(--text-light)] mb-12 max-w-2xl mx-auto">
              Начните изучать языки прямо сейчас! Доступно на iOS и Android
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <a 
                href="https://apps.apple.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 bg-black text-white px-8 py-4 rounded-2xl hover:bg-gray-800 transition-colors shadow-lg"
              >
                <div className="icon-smartphone text-3xl"></div>
                <div className="text-left">
                  <div className="text-xs">Загрузить в</div>
                  <div className="text-xl font-bold">App Store</div>
                </div>
              </a>
              
              <a 
                href="https://play.google.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 bg-black text-white px-8 py-4 rounded-2xl hover:bg-gray-800 transition-colors shadow-lg"
              >
                <div className="icon-smartphone text-3xl"></div>
                <div className="text-left">
                  <div className="text-xs">Загрузить в</div>
                  <div className="text-xl font-bold">Google Play</div>
                </div>
              </a>
            </div>
            
            <div className="mt-16 pt-8 border-t border-gray-300">
              <p className="text-sm text-[var(--text-light)]">
                © 2025 LinguaPlay. Все права защищены.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Download component error:', error);
    return null;
  }
}