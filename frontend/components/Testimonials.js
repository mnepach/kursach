function Testimonials() {
  const testimonials = [
    { name: 'Анна Петрова', role: 'Студентка', text: 'Благодаря LinguaPlay я начала свободно говорить по-английски всего за 6 месяцев!', rating: 5, avatar: '👩‍🎓' },
    { name: 'Михаил Соколов', role: 'Программист', text: 'Лучшее приложение для изучения языков! Геймификация действительно мотивирует.', rating: 5, avatar: '👨‍💻' },
    { name: 'Елена Волкова', role: 'Учитель', text: 'Рекомендую всем своим ученикам! Методика обучения действительно работает.', rating: 5, avatar: '👩‍🏫' },
    { name: 'Дмитрий Иванов', role: 'Менеджер', text: 'Изучал испанский для работы. За 4 месяца вышел на уровень B1! Невероятно удобно.', rating: 5, avatar: '👨‍💼' },
    { name: 'Ольга Смирнова', role: 'Дизайнер', text: 'Милые персонажи и интересные задания делают обучение приятным. Занимаюсь каждый день!', rating: 5, avatar: '👩‍🎨' },
    { name: 'Александр Козлов', role: 'Предприниматель', text: 'Учу корейский для бизнеса. Прогресс виден уже через месяц занятий. Отличное приложение!', rating: 5, avatar: '👨‍💼' },
    { name: 'Мария Новикова', role: 'Врач', text: 'Занимаюсь по 15 минут в день, и этого достаточно! Очень удобная система напоминаний.', rating: 5, avatar: '👩‍⚕️' },
    { name: 'Сергей Павлов', role: 'Инженер', text: 'Начинал с нуля, сейчас уже могу смотреть фильмы на английском. Спасибо LinguaPlay!', rating: 5, avatar: '👨‍🔧' }
  ];

  const [currentPage, setCurrentPage] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);
  const [direction, setDirection] = React.useState(null);
  const [displayPage, setDisplayPage] = React.useState(0);

  const totalPages = Math.ceil(testimonials.length / 3);

  const goToPage = (nextPage, dir) => {
    if (animating) return;
    setAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setDisplayPage(nextPage);
      setCurrentPage(nextPage);
      setDirection(null);
      setAnimating(false);
    }, 350);
  };

  const scrollLeft = () => {
    const next = currentPage === 0 ? totalPages - 1 : currentPage - 1;
    goToPage(next, 'right');
  };

  const scrollRight = () => {
    const next = currentPage === totalPages - 1 ? 0 : currentPage + 1;
    goToPage(next, 'left');
  };

  const startIndex = displayPage * 3;
  const visible = testimonials.slice(startIndex, startIndex + 3);

  return (
    <section id="testimonials" className="snap-section gradient-bg" style={{ overflow: 'visible' }}>
      <style>{`
        @keyframes slideInLeft { from { opacity:0; transform:translateX(-60px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideInRight { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }
        .slide-in-left { animation: slideInLeft 0.4s ease forwards; }
        .slide-in-right { animation: slideInRight 0.4s ease forwards; }
        .testimonial-enter { animation-duration: 0.4s; animation-fill-mode: forwards; animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        
        .testimonial-card {
          background: var(--card-bg, white);
          border-radius: 1.5rem;
          padding: 1.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          height: auto;
          min-height: 240px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(0, 0, 0, 0.05);
          will-change: transform;
        }
        
        .testimonial-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 40px -12px rgba(0, 0, 0, 0.2);
        }
        
        @media (max-width: 1024px) {
          .testimonial-card {
            min-height: 260px;
          }
        }
        
        @media (max-width: 768px) {
          .testimonial-card {
            min-height: auto;
            padding: 1.25rem;
          }
          .testimonial-card:hover {
            transform: translateY(-4px);
          }
        }
      `}</style>
      
      <div style={{ 
        maxWidth: "1280px", 
        margin: "0 auto", 
        padding: "4rem 2rem", 
        width: "100%",
        position: "relative",
        overflow: 'visible'
      }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "3rem", fontWeight: "bold", color: "var(--text-dark)", marginBottom: "1rem" }}>
            Что говорят <span style={{ color: "var(--primary-color)" }}>наши пользователи</span>
          </h2>
          <p style={{ fontSize: "1.25rem", color: "var(--text-light)", maxWidth: "40rem", margin: "0 auto" }}>
            Более 10 миллионов человек уже достигли своих языковых целей с нами
          </p>
        </div>

        <div style={{ 
          position: "relative",
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 40px",
          overflow: 'visible'
        }}>
          <button
            onClick={scrollLeft}
            style={{ 
              position: "absolute", 
              left: "-20px", 
              top: "50%", 
              transform: "translateY(-50%)", 
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              transition: "0.25s",
              zIndex: 10,
              color: "#4B5563"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary-color)";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.borderColor = "var(--primary-color)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#4B5563";
              e.currentTarget.style.borderColor = "#E2E8F0";
            }}
          >
            ❮
          </button>

          <div style={{ 
            overflow: 'visible',
            padding: '10px 0'
          }}>
            <div
              key={displayPage}
              className={direction === 'left' ? 'slide-in-left testimonial-enter' : direction === 'right' ? 'slide-in-right testimonial-enter' : ''}
              style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(3, 1fr)", 
                gap: "2rem"
              }}
            >
              {visible.map((t, i) => (
                <div key={startIndex + i} className="testimonial-card">
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                    <div style={{ 
                      width: "3.5rem", 
                      height: "3.5rem", 
                      borderRadius: "50%", 
                      background: "linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)",
                      display: "flex", 
                      justifyContent: "center", 
                      alignItems: "center", 
                      fontSize: "1.7rem", 
                      marginRight: "1rem",
                      flexShrink: 0
                    }}>
                      {t.avatar}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--text-dark)" }}>{t.name}</div>
                      <div style={{ color: "var(--text-light)", fontSize: "0.8rem" }}>{t.role}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: "0.75rem" }}>
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <span key={s} style={{ color: "#FBBF24", fontSize: "1.1rem" }}>★</span>
                    ))}
                  </div>
                  <p style={{ color: "var(--text-light)", fontSize: "0.95rem", lineHeight: "1.5", margin: 0 }}>"{t.text}"</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollRight}
            style={{ 
              position: "absolute", 
              right: "-20px", 
              top: "50%", 
              transform: "translateY(-50%)", 
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              transition: "0.25s",
              zIndex: 10,
              color: "#4B5563"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary-color)";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.borderColor = "var(--primary-color)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#4B5563";
              e.currentTarget.style.borderColor = "#E2E8F0";
            }}
          >
            ❯
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <div
                key={idx}
                onClick={() => goToPage(idx, idx > currentPage ? 'left' : 'right')}
                style={{ 
                  width: currentPage === idx ? "32px" : "10px", 
                  height: "10px", 
                  borderRadius: currentPage === idx ? "5px" : "50%", 
                  background: currentPage === idx ? "var(--primary-color)" : "#E2E8F0", 
                  transition: "all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)", 
                  cursor: "pointer",
                  display: "inline-block"
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}