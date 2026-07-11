import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { saveAuthSession } from "../auth/session";
import { TactileButton } from "../components/TactileButton";
import { useLanguage } from "../i18n";

export function LoginPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);
    setMessage(undefined);

    if (mode === "forgot") {
      const target = email.trim() || username.trim();
      const response = await api.requestPasswordReset(target.includes("@") ? { email: target } : { username: target });
      setLoading(false);
      if (!response.ok) {
        setError(response.error.message);
        return;
      }
      setMessage(response.data.supportedInCurrentMvp ? t("passwordResetSent") : t("passwordResetNotEnabled"));
      return;
    }

    const response = mode === "login"
      ? await api.login({ username, password })
      : await api.register({ username, password, displayName, email });
    setLoading(false);

    if (!response.ok) {
      setError(response.error.message);
      return;
    }

    saveAuthSession(response.data);
    navigate("/profile");
  }

  return (
    <div className="mx-auto max-w-md">
      <section className="rounded-xl bg-surface-container-low p-6">
        <div className="flex rounded-full bg-surface-container-lowest p-1">
          <button type="button" onClick={() => setMode("login")} className={`flex-1 rounded-full px-4 py-2 font-black ${mode === "login" ? "bg-primary-fixed text-primary" : ""}`}>{t("login")}</button>
          <button type="button" onClick={() => setMode("register")} className={`flex-1 rounded-full px-4 py-2 font-black ${mode === "register" ? "bg-primary-fixed text-primary" : ""}`}>{t("register")}</button>
        </div>
        {mode !== "register" && (
          <p className="mt-4 text-sm font-semibold text-on-surface-variant">
            {mode === "forgot" ? t("forgotPasswordHelp") : t("loginHelp")}
          </p>
        )}
        <form className="mt-6 space-y-4" onSubmit={(event) => void submit(event)}>
          {mode !== "forgot" && (
            <input value={username} onChange={(event) => setUsername(event.target.value)} className="w-full rounded-full bg-surface-container-lowest px-5 py-4 font-semibold outline-none" placeholder={t("usernameOrEmail")} autoComplete="username" />
          )}
          {mode === "register" && (
            <>
              <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="w-full rounded-full bg-surface-container-lowest px-5 py-4 font-semibold outline-none" placeholder={t("displayName")} autoComplete="name" />
              <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-full bg-surface-container-lowest px-5 py-4 font-semibold outline-none" placeholder={t("email")} autoComplete="email" type="email" />
            </>
          )}
          {mode === "forgot" && (
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-full bg-surface-container-lowest px-5 py-4 font-semibold outline-none" placeholder={t("emailOrUsername")} autoComplete="email" />
          )}
          {mode !== "forgot" && (
            <input
              value={password}
              onBlur={() => setPasswordFocused(false)}
              onChange={(event) => setPassword(event.target.value)}
              onFocus={() => setPasswordFocused(true)}
              className="w-full rounded-full bg-surface-container-lowest px-5 py-4 font-semibold outline-none"
              placeholder={t("password")}
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          )}
          {mode === "register" && passwordFocused && <p className="text-sm font-semibold text-on-surface-variant">{t("passwordRequirement")}</p>}
          {error && <p className="rounded-lg bg-error/10 p-3 font-bold text-error">{error}</p>}
          {message && <p className="rounded-lg bg-primary-fixed/40 p-3 font-bold text-primary">{message}</p>}
          <TactileButton className="w-full" disabled={loading}>{loading ? t("pleaseWait") : mode === "forgot" ? t("sendRecoveryInstructions") : t("continue")}</TactileButton>
        </form>
        {mode === "login" && (
          <button type="button" onClick={() => { setMode("forgot"); setError(undefined); setMessage(undefined); }} className="mt-5 w-full text-center text-sm font-black text-primary">
            {t("forgotPassword")}
          </button>
        )}
        {mode === "forgot" && (
          <button type="button" onClick={() => { setMode("login"); setError(undefined); setMessage(undefined); }} className="mt-5 w-full text-center text-sm font-black text-primary">
            {t("backToLogin")}
          </button>
        )}
      </section>
    </div>
  );
}
