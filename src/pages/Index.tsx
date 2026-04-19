import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "swipe" | "matches" | "profile" | "chat";

const PROFILES = [
  {
    id: 1,
    name: "Анастасия",
    age: 27,
    city: "Москва",
    profession: "Дизайнер интерьеров",
    bio: "Люблю находить красоту в деталях. Ищу человека с настоящим характером.",
    rating: 4.8,
    reviews: 12,
    tags: ["Искусство", "Путешествия", "Кулинария"],
    image: "https://cdn.poehali.dev/projects/83b5007a-dc9f-4a02-95e1-946d2d2ed063/files/ae938182-5e9b-4909-888f-1ef53495d44d.jpg",
  },
  {
    id: 2,
    name: "Михаил",
    age: 31,
    city: "Санкт-Петербург",
    profession: "Архитектор",
    bio: "Строю города и мечты. Ценю глубокие разговоры и утренний кофе без спешки.",
    rating: 4.6,
    reviews: 8,
    tags: ["Архитектура", "Джаз", "Бег"],
    image: "https://cdn.poehali.dev/projects/83b5007a-dc9f-4a02-95e1-946d2d2ed063/files/125bb6d7-b805-4657-be57-12b7f85e258e.jpg",
  },
  {
    id: 3,
    name: "Екатерина",
    age: 29,
    city: "Казань",
    profession: "Фотограф",
    bio: "Останавливаю мгновения, которые большинство не замечает. Жизнь слишком коротка для скучных людей.",
    rating: 4.9,
    reviews: 21,
    tags: ["Фотография", "Кино", "Книги"],
    image: "https://cdn.poehali.dev/projects/83b5007a-dc9f-4a02-95e1-946d2d2ed063/files/424b3379-1e70-4469-8b93-3fa860ea6411.jpg",
  },
  {
    id: 4,
    name: "Артём",
    age: 34,
    city: "Москва",
    profession: "Предприниматель",
    bio: "Запускаю проекты, которые меняют привычки людей. Ищу того, кто вдохновляет.",
    rating: 4.7,
    reviews: 15,
    tags: ["Бизнес", "Спорт", "Гастрономия"],
    image: "https://cdn.poehali.dev/projects/83b5007a-dc9f-4a02-95e1-946d2d2ed063/files/616e5fb6-e33e-4383-b57f-0678d5f2a86f.jpg",
  },
];

const MATCHES = [
  {
    id: 1,
    name: "Анастасия",
    image: "https://cdn.poehali.dev/projects/83b5007a-dc9f-4a02-95e1-946d2d2ed063/files/ae938182-5e9b-4909-888f-1ef53495d44d.jpg",
    lastMessage: "Привет! Увидела, что ты тоже любишь современное искусство 🎨",
    time: "14:32",
    unread: 2,
  },
  {
    id: 3,
    name: "Екатерина",
    image: "https://cdn.poehali.dev/projects/83b5007a-dc9f-4a02-95e1-946d2d2ed063/files/424b3379-1e70-4469-8b93-3fa860ea6411.jpg",
    lastMessage: "Когда ты в последний раз делал что-то впервые?",
    time: "Вчера",
    unread: 0,
  },
];

const CHAT_MESSAGES: Record<number, { id: number; text: string; mine: boolean; time: string }[]> = {
  1: [
    { id: 1, text: "Привет! Увидела, что ты тоже любишь современное искусство 🎨", mine: false, time: "14:30" },
    { id: 2, text: "Да! Особенно люблю минимализм. Что из последнего тебя впечатлило?", mine: true, time: "14:31" },
    { id: 3, text: "Была на выставке Родченко в прошлую субботу — просто невероятно", mine: false, time: "14:32" },
  ],
  3: [
    { id: 1, text: "Когда ты в последний раз делал что-то впервые?", mine: false, time: "Вчера" },
  ],
};

const REVIEWS = [
  { author: "Максим", rating: 5, text: "Очень интересный человек, отличное чувство юмора. Рекомендую!", avatar: "М" },
  { author: "Наталья", rating: 5, text: "Приятная беседа, умный и вдумчивый.", avatar: "Н" },
  { author: "Денис", rating: 4, text: "Хорошее общение, немного закрытый поначалу, но потом раскрылся.", avatar: "Д" },
];

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{ fontSize: size }}>
          {star <= Math.floor(rating) ? "★" : star - 0.5 <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-border rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-8 font-body">
            <span className="text-red-400">♥</span>
            Платформа искренних знакомств
          </div>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
          <h1 className="font-display text-6xl md:text-8xl font-light text-foreground leading-none mb-6">
            Найди<br />
            <em className="text-primary not-italic">своего</em><br />
            человека
          </h1>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
          <p className="font-body text-muted-foreground text-lg max-w-md mb-12 leading-relaxed">
            Не просто свайпы — настоящие профили с рейтингом и отзывами. Знай, кого встречаешь.
          </p>
        </div>

        <div className="animate-fade-up flex flex-col sm:flex-row gap-3" style={{ animationDelay: "240ms" }}>
          <button
            onClick={() => setPage("swipe")}
            className="bg-primary text-primary-foreground font-body font-medium px-8 py-3.5 rounded-full hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-lg shadow-primary/20"
          >
            Начать знакомиться
          </button>
          <button
            onClick={() => setPage("profile")}
            className="bg-white border border-border text-foreground font-body font-medium px-8 py-3.5 rounded-full hover:bg-secondary transition-all duration-200"
          >
            Мой профиль
          </button>
        </div>

        <div className="animate-fade-up mt-16 grid grid-cols-3 gap-8" style={{ animationDelay: "320ms" }}>
          {[
            { num: "2 841", label: "участников" },
            { num: "94%", label: "довольны" },
            { num: "4.8 ★", label: "средний рейтинг" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl font-light text-foreground">{stat.num}</div>
              <div className="font-body text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="animate-fade-up mt-16 relative" style={{ animationDelay: "400ms", height: 200, width: 280 }}>
          {PROFILES.slice(0, 3).map((p, i) => (
            <div
              key={p.id}
              className="absolute bg-white rounded-2xl shadow-xl overflow-hidden border border-border/50"
              style={{
                width: 160,
                height: 190,
                left: i * 36,
                top: i * -8,
                transform: `rotate(${(i - 1) * 6}deg)`,
                zIndex: 3 - i,
              }}
            >
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <div className="text-white text-xs font-body font-medium">{p.name}, {p.age}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SwipePage() {
  const [index, setIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const dragStartX = useRef(0);

  const current = PROFILES[index % PROFILES.length];
  const next = PROFILES[(index + 1) % PROFILES.length];

  const handleSwipe = (dir: "left" | "right") => {
    setSwipeDir(dir);
    if (dir === "right" && index === 0) {
      setTimeout(() => setShowMatch(true), 420);
    }
    setTimeout(() => {
      setSwipeDir(null);
      setDragX(0);
      setIndex((i) => i + 1);
    }, 450);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragX(e.clientX - dragStartX.current);
  };
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragX > 80) handleSwipe("right");
    else if (dragX < -80) handleSwipe("left");
    else setDragX(0);
  };

  const rotation = isDragging ? dragX * 0.08 : 0;
  const likeOpacity = Math.min(1, Math.max(0, dragX / 100));
  const nopeOpacity = Math.min(1, Math.max(0, -dragX / 100));

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-80px)] pt-8 pb-4 px-4">
      <h2 className="font-display text-3xl font-light text-foreground mb-6">Знакомства</h2>

      {showMatch && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowMatch(false)}
        >
          <div className="bg-white rounded-3xl p-10 text-center max-w-sm mx-4 shadow-2xl" style={{ animation: "card-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards" }}>
            <div className="text-6xl mb-4">💕</div>
            <h3 className="font-display text-4xl font-light text-foreground mb-2">Взаимная симпатия!</h3>
            <p className="font-body text-muted-foreground mb-6">
              Ты и <strong>Анастасия</strong> понравились друг другу
            </p>
            <button
              className="bg-red-400 text-white font-body font-medium px-8 py-3 rounded-full w-full hover:bg-red-500 transition-colors"
              onClick={() => setShowMatch(false)}
            >
              Написать сообщение
            </button>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-sm" style={{ height: 520 }}>
        <div
          className="absolute inset-0 bg-white rounded-3xl shadow-lg overflow-hidden border border-border/30"
          style={{ transform: "scale(0.94) translateY(20px)", zIndex: 0 }}
        >
          <img src={next.image} alt="" className="w-full h-full object-cover" />
        </div>

        <div
          key={index}
          className={`absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-border/30 select-none ${
            swipeDir === "left" ? "animate-swipe-left" : swipeDir === "right" ? "animate-swipe-right" : "animate-card-in"
          }`}
          style={{
            zIndex: 1,
            cursor: isDragging ? "grabbing" : "grab",
            transform: isDragging ? `translateX(${dragX}px) rotate(${rotation}deg)` : undefined,
            transition: isDragging ? "none" : undefined,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img src={current.image} alt={current.name} className="w-full h-[62%] object-cover" draggable={false} />

          <div
            className="absolute top-6 left-6 border-4 border-green-400 text-green-400 font-display text-2xl font-bold px-3 py-1 rounded-xl"
            style={{ opacity: likeOpacity, transform: "rotate(-12deg)" }}
          >
            ЛЮБЛЮ
          </div>
          <div
            className="absolute top-6 right-6 border-4 border-red-400 text-red-400 font-display text-2xl font-bold px-3 py-1 rounded-xl"
            style={{ opacity: nopeOpacity, transform: "rotate(12deg)" }}
          >
            ПРОПУСК
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-display text-3xl font-medium text-foreground">
                  {current.name}, {current.age}
                </h3>
                <p className="font-body text-muted-foreground text-sm flex items-center gap-1 mt-0.5">
                  <Icon name="MapPin" size={12} />
                  {current.city} · {current.profession}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <StarRating rating={current.rating} size={13} />
                  <span className="font-body text-sm font-semibold text-foreground">{current.rating}</span>
                </div>
                <span className="font-body text-xs text-muted-foreground">{current.reviews} отзывов</span>
              </div>
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">{current.bio}</p>
            <div className="flex flex-wrap gap-1.5">
              {current.tags.map((tag) => (
                <span key={tag} className="bg-secondary text-secondary-foreground font-body text-xs px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-8">
        <button
          onClick={() => handleSwipe("left")}
          className="w-14 h-14 rounded-full bg-white border-2 border-red-200 text-red-400 flex items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all duration-200 hover:scale-110 shadow-md"
        >
          <Icon name="X" size={22} />
        </button>
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="w-10 h-10 rounded-full bg-white border border-border text-muted-foreground flex items-center justify-center hover:bg-secondary transition-all duration-200 shadow-sm"
        >
          <Icon name="RotateCcw" size={16} />
        </button>
        <button
          onClick={() => handleSwipe("right")}
          className="w-14 h-14 rounded-full bg-white border-2 border-green-200 text-green-500 flex items-center justify-center hover:bg-green-50 hover:border-green-400 transition-all duration-200 hover:scale-110 shadow-md"
        >
          <Icon name="Heart" size={22} />
        </button>
      </div>

      <p className="font-body text-xs text-muted-foreground mt-4">Перетащи карточку или используй кнопки</p>
    </div>
  );
}

function MatchesPage({
  setPage,
  setChatId,
}: {
  setPage: (p: Page) => void;
  setChatId: (id: number) => void;
}) {
  return (
    <div className="min-h-[calc(100vh-80px)] px-4 pt-8 pb-4">
      <h2 className="font-display text-3xl font-light text-foreground mb-1">Матчи</h2>
      <p className="font-body text-muted-foreground text-sm mb-6">Взаимные симпатии</p>

      <div className="mb-6">
        <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-3">Новые симпатии</p>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {PROFILES.map((p) => (
            <div key={p.id} className="flex-shrink-0 text-center">
              <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-red-300 ring-offset-2 mb-1">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <p className="font-body text-xs text-foreground">{p.name}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-3">Сообщения</p>
      <div className="space-y-3">
        {MATCHES.map((match) => (
          <button
            key={match.id}
            onClick={() => {
              setChatId(match.id);
              setPage("chat");
            }}
            className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200 border border-border/50 text-left"
          >
            <div className="relative flex-shrink-0">
              <img src={match.image} alt={match.name} className="w-14 h-14 rounded-full object-cover" />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-body font-semibold text-foreground">{match.name}</span>
                <span className="font-body text-xs text-muted-foreground">{match.time}</span>
              </div>
              <p className="font-body text-sm text-muted-foreground truncate">{match.lastMessage}</p>
            </div>
            {match.unread > 0 && (
              <span className="bg-red-400 text-white font-body text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                {match.unread}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatPage({ matchId, setPage }: { matchId: number; setPage: (p: Page) => void }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(CHAT_MESSAGES[matchId] || []);
  const match = MATCHES.find((m) => m.id === matchId);

  if (!match) return null;

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: message,
        mine: true,
        time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-0px)]">
      <div className="bg-white border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setPage("matches")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="ChevronLeft" size={24} />
        </button>
        <img src={match.image} alt={match.name} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="font-body font-semibold text-foreground">{match.name}</p>
          <p className="font-body text-xs text-green-500">онлайн</p>
        </div>
        <div className="ml-auto">
          <Icon name="MoreHorizontal" size={20} className="text-muted-foreground" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-background">
        <div className="text-center mb-4">
          <span className="font-body text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">Вы совпали! Начните разговор</span>
        </div>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                msg.mine
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-white border border-border text-foreground rounded-bl-sm shadow-sm"
              }`}
            >
              <p className="font-body text-sm leading-relaxed">{msg.text}</p>
              <p className={`font-body text-xs mt-1 ${msg.mine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border-t border-border px-4 py-3 flex items-center gap-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Напиши что-нибудь..."
          className="flex-1 bg-secondary rounded-full px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
        <button
          onClick={sendMessage}
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-105 flex-shrink-0"
        >
          <Icon name="Send" size={16} />
        </button>
      </div>
    </div>
  );
}

function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"info" | "reviews">("info");
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [reviews, setReviews] = useState(REVIEWS);

  const addReview = () => {
    if (!newReview.trim()) return;
    setReviews((r) => [...r, { author: "Вы", rating: newRating, text: newReview, avatar: "В" }]);
    setNewReview("");
  };

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="min-h-[calc(100vh-80px)] pb-6">
      <div className="relative h-44 bg-gradient-to-br from-primary/20 to-red-100 overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, hsl(var(--primary)) 0%, transparent 60%), radial-gradient(circle at 70% 50%, hsl(350, 65%, 70%) 0%, transparent 60%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="px-4 -mt-12 relative">
        <div className="flex items-end justify-between mb-4">
          <div className="relative">
            <img
              src="https://cdn.poehali.dev/projects/83b5007a-dc9f-4a02-95e1-946d2d2ed063/files/125bb6d7-b805-4657-be57-12b7f85e258e.jpg"
              alt="Профиль"
              className="w-24 h-24 rounded-2xl object-cover border-4 border-background shadow-lg"
            />
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
              <Icon name="Camera" size={14} />
            </button>
          </div>
          <button className="bg-white border border-border text-foreground font-body text-sm font-medium px-4 py-2 rounded-full hover:bg-secondary transition-colors flex items-center gap-2">
            <Icon name="Edit2" size={14} />
            Изменить
          </button>
        </div>

        <h2 className="font-display text-3xl font-medium text-foreground">Алексей, 30</h2>
        <p className="font-body text-muted-foreground text-sm flex items-center gap-1 mt-0.5 mb-3">
          <Icon name="MapPin" size={12} />
          Москва · Разработчик
        </p>

        <div className="flex items-center gap-2 mb-5">
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
            <StarRating rating={parseFloat(avgRating)} size={13} />
            <span className="font-body text-sm font-semibold text-amber-700">{avgRating}</span>
            <span className="font-body text-xs text-amber-600">· {reviews.length} отзывов</span>
          </div>
        </div>

        <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-5">
          {(["info", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 font-body text-sm py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab ? "bg-white text-foreground shadow-sm font-medium" : "text-muted-foreground"
              }`}
            >
              {tab === "info" ? "О себе" : `Отзывы (${reviews.length})`}
            </button>
          ))}
        </div>

        {activeTab === "info" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-border/50">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">О себе</p>
              <p className="font-body text-sm text-foreground leading-relaxed">
                Разработчик с душой художника. Люблю горы, хорошую музыку и людей с огнём в глазах. Ищу того, с кем интересно молчать.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-border/50">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-3">Интересы</p>
              <div className="flex flex-wrap gap-2">
                {["Горы", "Музыка", "Кино", "Кулинария", "Чтение", "Технологии"].map((tag) => (
                  <span key={tag} className="bg-secondary text-secondary-foreground font-body text-xs px-3 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-border/50">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-3">Параметры</p>
              <div className="grid grid-cols-2 gap-3 font-body text-sm">
                <div>
                  <span className="text-muted-foreground">Рост:</span> <span className="font-medium text-foreground">182 см</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Цель:</span> <span className="font-medium text-foreground">Отношения</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Дети:</span> <span className="font-medium text-foreground">Нет</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Образование:</span> <span className="font-medium text-foreground">Высшее</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-3">
            {reviews.map((review, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center font-body font-semibold text-sm text-foreground flex-shrink-0">
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-body font-semibold text-sm text-foreground">{review.author}</span>
                      <StarRating rating={review.rating} size={12} />
                    </div>
                  </div>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{review.text}</p>
              </div>
            ))}

            <div className="bg-white rounded-2xl p-4 border border-primary/20">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-3">Оставить отзыв</p>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setNewRating(s)}
                    className="text-2xl text-amber-400 transition-transform hover:scale-110"
                  >
                    {s <= newRating ? "★" : "☆"}
                  </button>
                ))}
              </div>
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Поделись впечатлением..."
                className="w-full bg-secondary rounded-xl px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:ring-2 focus:ring-primary/30 transition-all"
                rows={3}
              />
              <button
                onClick={addReview}
                className="mt-2 w-full bg-primary text-primary-foreground font-body font-medium py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Опубликовать отзыв
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [chatId, setChatId] = useState<number>(1);

  const navItems: { id: Page; icon: string; label: string }[] = [
    { id: "home", icon: "Compass", label: "Главная" },
    { id: "swipe", icon: "Layers", label: "Свайп" },
    { id: "matches", icon: "Heart", label: "Матчи" },
    { id: "profile", icon: "User", label: "Профиль" },
  ];

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <div className={page === "chat" ? "" : "pb-20"}>
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "swipe" && <SwipePage />}
        {page === "matches" && <MatchesPage setPage={setPage} setChatId={setChatId} />}
        {page === "chat" && <ChatPage matchId={chatId} setPage={setPage} />}
        {page === "profile" && <ProfilePage />}
      </div>

      {page !== "chat" && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/90 backdrop-blur-md border-t border-border px-2 py-2 z-40">
          <div className="flex items-center justify-around">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200 ${
                  page === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  name={item.icon}
                  size={22}
                  className={`transition-transform duration-200 ${page === item.id ? "scale-110" : ""}`}
                />
                <span className="font-body text-xs">{item.label}</span>
                {page === item.id && <span className="w-1 h-1 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
