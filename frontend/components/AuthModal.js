function AuthModal({ onClose, onLogin }) {
  try {
    const [showDashboard, setShowDashboard] = React.useState(false);
    const [showRegister, setShowRegister] = React.useState(false);
    const [showPlans, setShowPlans] = React.useState(false);
    const [showEditProfile, setShowEditProfile] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [userData, setUserData] = React.useState(null);
    const [progressData, setProgressData] = React.useState([]);
    const [showPassword, setShowPassword] = React.useState(false);

    React.useEffect(() => {
      const token = localStorage.getItem('token');
      if (token && !userData) {
        loadUserData();
      }
    }, []);

    React.useEffect(() => {
      if (showDashboard && api.token) {
        loadUserData();
      }
    }, [showDashboard]);

    const loadUserData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          api.getProfile(),
          api.getOverallStats()
        ]);
        
        setUserData(profileRes.user);
        setProgressData(statsRes.stats.languages || []);
        setShowDashboard(true);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setError('Ошибка загрузки данных пользователя');
      }
    };

    const handleSubmit = async (e) => {
      if (e) e.preventDefault();
      setError('');
      setLoading(true);

      try {
        const response = await api.login({ email, password });
        setUserData(response.user);
        setShowDashboard(true);
        onLogin();
      } catch (err) {
        setError(err.message || 'Ошибка при входе');
        setShowDashboard(false);
      } finally {
        setLoading(false);
      }
    };

    const handleClose = () => {
      setShowDashboard(false);
      setShowRegister(false);
      setShowPlans(false);
      setShowEditProfile(false);
      onClose();
    };

    const handleLogout = () => {
      api.logout();
      setShowDashboard(false);
      setUserData(null);
      setProgressData([]);
      setEmail('');
      setPassword('');
      onClose();
    };

    if (showRegister) {
      return (
        <RegisterModal 
          onClose={handleClose}
          onRegister={async () => {
            setShowRegister(false);
            await loadUserData();
            onLogin();
          }}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }

    if (showPlans) {
      return (
        <SubscriptionPlans 
          onClose={() => setShowPlans(false)}
          onUpgrade={async () => {
            setShowPlans(false);
            await loadUserData();
          }}
        />
      );
    }

    if (showEditProfile && userData) {
      return (
        <EditProfileModal
          userData={userData}
          onClose={() => setShowEditProfile(false)}
          onSave={async () => {
            setShowEditProfile(false);
            await loadUserData();
          }}
        />
      );
    }

    if (showDashboard && userData) {
      const planType = userData.subscription?.planType || 'free';
      
      return (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[9999] p-4" 
          style={{
            background: 'linear-gradient(135deg, #E0F2FE 0%, #FFFFFF 50%, #F3E8FF 100%)'
          }}
          onClick={handleClose}
        >
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-6">
                  <div 
                    className="w-24 h-24 bg-gradient-blue rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative group"
                    onClick={() => setShowEditProfile(true)}
                  >
                    <img 
                      src={userData.avatar || "./trickle/assets/icon.jpg"}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-[var(--text-dark)] mb-1">{userData.name}</h2>
                    <p className="text-[var(--text-light)]">{userData.email}</p>
                    <button 
                      onClick={() => setShowEditProfile(true)}
                      className="text-[var(--primary-color)] text-sm hover:underline mt-1"
                    >
                      Редактировать профиль
                    </button>
                  </div>
                </div>
                <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className={`${planType === 'free' ? 'bg-gray-100' : 'bg-gradient-blue'} rounded-2xl p-8 mb-8`}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className={`text-2xl font-bold ${planType === 'free' ? 'text-[var(--text-dark)]' : 'text-white'} mb-1`}>
                      {planType === 'free' ? 'Бесплатный план' : planType === 'basic' ? 'Базовый план' : 'Премиум план'}
                    </h3>
                    <p className={`${planType === 'free' ? 'text-gray-600' : 'text-white/90'}`}>
                      {planType === 'free' ? 'Базовые возможности обучения' : 'Безлимитный доступ ко всем функциям'}
                    </p>
                  </div>
                  {planType === 'free' && (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  )}
                </div>
                <button 
                  onClick={() => setShowPlans(true)}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${planType === 'free' ? 'bg-[var(--primary-color)] text-white hover:bg-[var(--accent-color)]' : 'bg-white text-[var(--primary-color)] hover:bg-gray-100'}`}
                >
                  {planType === 'free' ? 'Перейти на Премиум' : 'Управление подпиской'}
                </button>
              </div>
              
              <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-6">Ваша статистика</h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-orange-50 rounded-2xl p-6">
                  <div className="text-4xl mb-3">🔥</div>
                  <div className="text-4xl font-bold text-[var(--text-dark)] mb-1">
                    {userData.statistics?.streak || 0}
                  </div>
                  <div className="text-sm text-[var(--text-light)]">Дней подряд</div>
                </div>
                <div className="bg-yellow-50 rounded-2xl p-6">
                  <div className="text-4xl mb-3">🏆</div>
                  <div className="text-4xl font-bold text-[var(--text-dark)] mb-1">
                    {userData.statistics?.experience || 0}
                  </div>
                  <div className="text-sm text-[var(--text-light)]">Очков опыта</div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-6">
                  <div className="text-4xl mb-3">⭐</div>
                  <div className="text-4xl font-bold text-[var(--text-dark)] mb-1">
                    {userData.statistics?.achievements || 0}
                  </div>
                  <div className="text-sm text-[var(--text-light)]">Достижений</div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-4">Прогресс обучения</h3>
              <div className="space-y-6 mb-8">
                {progressData.length > 0 ? (
                  progressData.map((lang, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-3">
                        <span className="font-bold text-lg">{lang.language}</span>
                        <span className="text-[var(--primary-color)] font-bold">{lang.progress}%</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[var(--primary-color)] rounded-full transition-all" 
                          style={{ width: `${lang.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[var(--text-light)]">Начните изучение языка, чтобы увидеть прогресс</p>
                )}
              </div>
              
              <button 
                onClick={handleLogout} 
                className="w-full py-4 border-2 border-gray-300 rounded-xl font-bold text-[var(--text-dark)] hover:bg-gray-50 transition-colors"
              >
                Выйти из аккаунта
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{background: 'linear-gradient(135deg, #E0F2FE 0%, #FFFFFF 50%, #F3E8FF 100%)'}} onClick={handleClose}>
        <div className="bg-white rounded-3xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--text-dark)]">
              Вход
            </h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                placeholder="your@email.com"
                disabled={loading}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] pr-12"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <button 
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Загрузка...' : 'Войти'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => setShowRegister(true)}
              className="text-[var(--primary-color)] hover:underline"
              disabled={loading}
            >
              Нет аккаунта? Зарегистрируйтесь
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