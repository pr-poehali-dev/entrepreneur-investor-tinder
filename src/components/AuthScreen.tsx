import { useState } from "react";
import Icon from "@/components/ui/icon";

const AUTH_URL = "https://functions.poehali.dev/78835576-3fa5-47dd-95f5-dabb5d8d074c";

type Step = "contact" | "otp" | "name";

interface AuthScreenProps {
  onAuth: (user: { id: number; name: string; token: string }) => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [step, setStep] = useState<Step>("contact");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [isEmail, setIsEmail] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState("");

  const isEmailInput = contact.includes("@");

  const handleSendOtp = async () => {
    if (!contact.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", contact: contact.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка отправки");
      setIsEmail(data.is_email);
      setDevCode(data.dev_code || "");
      setStep("otp");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", contact: contact.trim(), code: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Неверный код");
      if (data.is_new) {
        setIsNew(true);
        setName(data.name || "");
        setStep("name");
      } else {
        onAuth({ id: data.user_id, name: data.name, token: data.token });
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_name", data.name);
        localStorage.setItem("auth_id", String(data.user_id));
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handleSetName = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", contact: contact.trim(), code: otp, name: name.trim() }),
      });
      const data = await res.json();
      if (data.ok || data.token) {
        onAuth({ id: data.user_id, name: name.trim(), token: data.token });
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_name", name.trim());
        localStorage.setItem("auth_id", String(data.user_id));
      } else {
        setError(data.error || "Ошибка");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent)" }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent)" }} />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <span className="text-3xl">💼</span>
          </div>
          <h1 className="font-display text-4xl font-light text-foreground">Инвестор</h1>
          <p className="font-body text-muted-foreground text-sm mt-1">Найди своего инвестора</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl border border-border/50">

          {/* Step: contact */}
          {step === "contact" && (
            <div>
              <h2 className="font-display text-2xl text-foreground mb-1">Вход или регистрация</h2>
              <p className="font-body text-muted-foreground text-sm mb-5">Введи email или номер телефона</p>

              <div className="relative mb-4">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Icon name={isEmailInput ? "Mail" : "Phone"} size={18} />
                </div>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => { setContact(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  placeholder="email или +7 999 ..."
                  className="w-full bg-secondary rounded-2xl pl-11 pr-4 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  autoFocus
                />
              </div>

              {error && (
                <p className="font-body text-sm text-destructive mb-3 flex items-center gap-1.5">
                  <Icon name="AlertCircle" size={14} />
                  {error}
                </p>
              )}

              <button
                onClick={handleSendOtp}
                disabled={!contact.trim() || loading}
                className="w-full bg-primary text-primary-foreground font-body font-medium py-3.5 rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>Получить код <Icon name="ArrowRight" size={16} /></>
                )}
              </button>

              <p className="font-body text-xs text-muted-foreground text-center mt-4">
                Нажимая кнопку, ты соглашаешься с условиями использования
              </p>
            </div>
          )}

          {/* Step: OTP */}
          {step === "otp" && (
            <div>
              <button onClick={() => { setStep("contact"); setOtp(""); setError(""); }}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-body text-sm mb-4 transition-colors">
                <Icon name="ChevronLeft" size={16} /> Назад
              </button>

              <h2 className="font-display text-2xl text-foreground mb-1">Введи код</h2>
              <p className="font-body text-muted-foreground text-sm mb-5">
                Отправили 6-значный код на{" "}
                <span className="text-foreground font-medium">{contact}</span>
              </p>

              {devCode && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4 flex items-center gap-2">
                  <Icon name="Info" size={14} className="text-amber-600 flex-shrink-0" />
                  <p className="font-body text-xs text-amber-700">
                    Тестовый код: <strong>{devCode}</strong>
                  </p>
                </div>
              )}

              {/* OTP input boxes */}
              <div className="flex gap-2 mb-4 justify-between">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i] || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      const arr = otp.split("");
                      arr[i] = val;
                      const next = arr.join("").slice(0, 6);
                      setOtp(next);
                      setError("");
                      if (val && i < 5) {
                        const nextInput = document.getElementById(`otp-${i + 1}`);
                        nextInput?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) {
                        const prev = document.getElementById(`otp-${i - 1}`);
                        prev?.focus();
                      }
                    }}
                    onPaste={(e) => {
                      const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                      setOtp(paste);
                      e.preventDefault();
                    }}
                    id={`otp-${i}`}
                    className={`w-11 h-12 text-center font-body text-lg font-semibold rounded-xl border-2 outline-none transition-all bg-secondary text-foreground ${
                      otp[i] ? "border-primary" : "border-border focus:border-primary"
                    }`}
                  />
                ))}
              </div>

              {error && (
                <p className="font-body text-sm text-destructive mb-3 flex items-center gap-1.5">
                  <Icon name="AlertCircle" size={14} />
                  {error}
                </p>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={otp.length < 6 || loading}
                className="w-full bg-primary text-primary-foreground font-body font-medium py-3.5 rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                ) : "Подтвердить"}
              </button>

              <button
                onClick={handleSendOtp}
                className="w-full mt-3 font-body text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Отправить код повторно
              </button>
            </div>
          )}

          {/* Step: name (новый пользователь) */}
          {step === "name" && (
            <div>
              <h2 className="font-display text-2xl text-foreground mb-1">Как тебя зовут?</h2>
              <p className="font-body text-muted-foreground text-sm mb-5">
                Это имя увидят другие участники
              </p>

              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSetName()}
                placeholder="Твоё имя"
                className="w-full bg-secondary rounded-2xl px-4 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all mb-4"
                autoFocus
              />

              {error && (
                <p className="font-body text-sm text-destructive mb-3 flex items-center gap-1.5">
                  <Icon name="AlertCircle" size={14} />
                  {error}
                </p>
              )}

              <button
                onClick={handleSetName}
                disabled={!name.trim() || loading}
                className="w-full bg-primary text-primary-foreground font-body font-medium py-3.5 rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                ) : <>Начать <Icon name="ArrowRight" size={16} /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
