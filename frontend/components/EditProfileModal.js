function EditProfileModal({ userData, onClose, onSave }) {
  const [name, setName] = React.useState(userData.name || '');
  const [avatar, setAvatar] = React.useState(userData.avatar || '');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [previewUrl, setPreviewUrl] = React.useState(userData.avatar || './trickle/assets/default-avatar.png');
  const fileInputRef = React.useRef(null);
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

  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob.size > 100 * 1024) {
                compressImage(file, maxWidth * 0.8, quality * 0.8).then(resolve).catch(reject);
              } else {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      setError('Пожалуйста, выберите изображение в формате JPG или PNG');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5 МБ');
      return;
    }

    setError('');

    try {
      const compressedBase64 = await compressImage(file);
      setPreviewUrl(compressedBase64);
      setAvatar(compressedBase64);
    } catch (err) {
      setError('Ошибка при обработке изображения');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.updateProfile({
        name: name.trim(),
        avatar: avatar
      });
      onSave();
    } catch (err) {
      setError(err.message || 'Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[10000] p-4" 
      style={{
        backgroundImage: 'url(./trickle/assets/profile_background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'crisp-edges',
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
          backgroundImage: 'url(./trickle/assets/profile_background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translate(${mousePos.x}px, ${mousePos.y + scrollY * 0.5}px)`,
          transition: 'transform 0.1s ease-out',
          zIndex: -1
        }}
      ></div>
      <BubbleAnimation />
      <div className="bg-white rounded-3xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--text-dark)]">Редактировать профиль</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div 
                className="w-32 h-32 rounded-full overflow-hidden cursor-pointer relative"
                onClick={() => fileInputRef.current?.click()}
              >
                <img 
                  src={previewUrl}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = './trickle/assets/default-avatar.png';
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <p className="text-sm text-[var(--text-light)] mt-3 text-center">
              Нажмите на аватар, чтобы изменить фото<br/>
              <span className="text-xs">JPG, PNG. Максимум 5 МБ</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              placeholder="Ваше имя"
              required
              disabled={loading}
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={userData.email}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-gray-400 mt-1">Email нельзя изменить</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-bold text-[var(--text-dark)] hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading || !name.trim()}
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BubbleAnimation() {
  return (
    <>
      <style>
        {`
          @keyframes float-up {
            0% {
              transform: translateY(100vh) translateX(0) scale(1);
              opacity: 0.7;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100px) translateX(var(--float-x)) scale(1.2);
              opacity: 0;
            }
          }

          .bubble {
            position: fixed;
            bottom: -100px;
            width: var(--size);
            height: var(--size);
            background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(96, 165, 250, 0.4));
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: float-up var(--duration) ease-in-out infinite;
            animation-delay: var(--delay);
            box-shadow: 
              inset 0 0 20px rgba(255, 255, 255, 0.5),
              0 0 20px rgba(96, 165, 250, 0.3);
          }

          .bubble::before {
            content: '';
            position: absolute;
            top: 10%;
            left: 15%;
            width: 40%;
            height: 40%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.9), transparent);
            border-radius: 50%;
          }

          .bubble::after {
            content: '';
            position: absolute;
            bottom: 15%;
            right: 20%;
            width: 20%;
            height: 20%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.6), transparent);
            border-radius: 50%;
          }
        `}
      </style>
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="bubble"
          style={{
            '--size': `${Math.random() * 60 + 40}px`,
            '--duration': `${Math.random() * 5 + 8}s`,
            '--delay': `${Math.random() * 5}s`,
            '--float-x': `${(Math.random() - 0.5) * 200}px`,
            left: `${Math.random() * 100}%`
          }}
        />
      ))}
    </>
  );
}