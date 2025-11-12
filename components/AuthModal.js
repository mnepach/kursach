function AuthModal({ onClose, onLogin }) {
  try {
    const [isLogin, setIsLogin] = React.useState(true);
    const [showDashboard, setShowDashboard] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [userName, setUserName] = React.useState('Анна Петрова');
    const [planType, setPlanType] = React.useState('free');

    const handleSubmit = (e) => {
      e.preventDefault();
      setShowDashboard(true);
    };

    const handleClose = () => {
      setShowDashboard(false);
      onClose();
    };

    if (showDashboard) {
      return (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4" 
          style={{
            backgroundImage: 'url(../trickle/assets/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-blue rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                       <img 
                       src="../trickle/assets/icon.jpg" 
                        alt="User avatar"
                        className="w-full h-full object-cover rounded-full"
                     />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-[var(--text-dark)] mb-1">{userName}</h2>
                    <p className="text-[var(--text-light)]">{email || 'anna@example.com'}</p>
                  </div>
                </div>
                <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <div className="icon-x text-3xl"></div>
                </button>
              </div>
              
              <div className={`${planType === 'free' ? 'bg-gray-100' : 'bg-gradient-blue'} rounded-2xl p-8 mb-8`}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className={`text-2xl font-bold ${planType === 'free' ? 'text-[var(--text-dark)]' : 'text-white'} mb-1`}>
                      {planType === 'free' ? 'Бесплатный план' : 'Премиум план'}
                    </h3>
                    <p className={`${planType === 'free' ? 'text-gray-600' : 'text-white/90'}`}>
                      {planType === 'free' ? 'Базовые возможности обучения' : 'Безлимитный доступ ко всем функциям'}
                    </p>
                  </div>
                  {planType === 'free' && (
                    <div className="icon-lock text-4xl text-gray-400"></div>
                  )}
                </div>
                <button className={`w-full py-3 rounded-xl font-bold transition-all ${planType === 'free' ? 'bg-[var(--primary-color)] text-white hover:bg-[var(--accent-color)]' : 'bg-white text-[var(--primary-color)] hover:bg-gray-100'}`}>
                  {planType === 'free' ? 'Перейти на Премиум' : 'Управление подпиской'}
                </button>
              </div>
              
              <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-6">Ваша статистика</h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-orange-50 rounded-2xl p-6">
                  <div className="icon-flame text-4xl text-orange-500 mb-3"></div>
                  <div className="text-4xl font-bold text-[var(--text-dark)] mb-1">15</div>
                  <div className="text-sm text-[var(--text-light)]">Дней подряд</div>
                </div>
                <div className="bg-yellow-50 rounded-2xl p-6">
                  <div className="icon-trophy text-4xl text-yellow-600 mb-3"></div>
                  <div className="text-4xl font-bold text-[var(--text-dark)] mb-1">1,250</div>
                  <div className="text-sm text-[var(--text-light)]">Очков опыта</div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-6">
                  <div className="icon-star text-4xl text-[var(--primary-color)] mb-3"></div>
                  <div className="text-4xl font-bold text-[var(--text-dark)] mb-1">8</div>
                  <div className="text-sm text-[var(--text-light)]">Достижений</div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-4">Прогресс обучения</h3>
              <div className="space-y-6 mb-8">
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="font-bold text-lg">Английский язык</span>
                    <span className="text-[var(--primary-color)] font-bold">75%</span>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--primary-color)] rounded-full transition-all" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="font-bold text-lg">Испанский язык</span>
                    <span className="text-[var(--primary-color)] font-bold">45%</span>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--primary-color)] rounded-full transition-all" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
              
              <button onClick={handleClose} className="w-full py-4 border-2 border-gray-300 rounded-xl font-bold text-[var(--text-dark)] hover:bg-gray-50 transition-colors">
                Выйти из аккаунта
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-3xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--text-dark)]">
              {isLogin ? 'Вход' : 'Регистрация'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <div className="icon-x text-2xl"></div>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button type="submit" className="btn-primary w-full">
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[var(--primary-color)] hover:underline"
            >
              {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AuthModal component error:', error);
    return null;
  }
}