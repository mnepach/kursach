function WelcomeCharacter({ onNext }) {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between p-8"
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(./trickle/assets/onboarding_background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translate(${mousePos.x}px, ${mousePos.y + scrollY * 0.5}px)`,
          transition: 'transform 0.1s ease-out',
          zIndex: -1
        }}
      ></div>

      <div className="flex-1"></div>
      
      <div className="max-w-4xl w-full flex items-end justify-center gap-8 mb-8">
        <img 
          src="./trickle/assets/mascot.gif" 
          alt="Hello Kitty"
          className="w-96 h-96 object-contain"
          style={{
            WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 75%)',
            maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 75%)'
          }}
        />

        <div className="relative mb-10">
          <div 
            className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-[var(--primary-color)]"
            style={{ minWidth: '280px', maxWidth: '350px' }}
          >
            <p className="text-2xl font-bold text-[var(--text-dark)] mb-2">
              Привет! Я Hello Kitty 👋
            </p>
            <p className="text-[var(--text-dark)] text-lg">
              Я буду твоим проводником в мире LinguaPlay! Нажми "Далее", чтобы продолжить.
            </p>
          </div>
          
          <div className="absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 w-0 h-0 border-t-[12px] border-b-[12px] border-r-[18px] border-t-transparent border-b-transparent border-r-[var(--primary-color)]"></div>
          <div className="absolute top-1/2 left-0 transform -translate-x-[calc(100%-4px)] -translate-y-1/2 w-0 h-0 border-t-[12px] border-b-[12px] border-r-[18px] border-t-transparent border-b-transparent border-r-white"></div>
        </div>
      </div>
      
      <div className="w-full max-w-4xl border-t-2 border-gray-300 pt-6">
        <button onClick={onNext} className="btn-primary ml-auto block px-12 py-4">
          Далее
        </button>
      </div>
    </div>
  );
}

export default WelcomeCharacter;