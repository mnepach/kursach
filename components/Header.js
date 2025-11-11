function Header({ onAuthClick, isLoggedIn }) {
  try {
    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    return (
      <header 
        className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50"
        data-name="header"
        data-file="components/Header.js"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[var(--primary-color)] rounded-full flex items-center justify-center">
                <div className="icon-sparkles text-xl text-white"></div>
              </div>
              <span className="text-2xl font-bold text-[var(--primary-color)]">LinguaPlay</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('hero')} className="text-[var(--text-dark)] hover:text-[var(--primary-color)] transition-colors">
                Главная
              </button>
              <button onClick={() => scrollToSection('features')} className="text-[var(--text-dark)] hover:text-[var(--primary-color)] transition-colors">
                Возможности
              </button>
              <button onClick={() => scrollToSection('download')} className="text-[var(--text-dark)] hover:text-[var(--primary-color)] transition-colors">
                Скачать
              </button>
            </nav>
            
            <button onClick={onAuthClick} className="btn-primary">
              {isLoggedIn ? 'Личный кабинет' : 'Войти'}
            </button>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}