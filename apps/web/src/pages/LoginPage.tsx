import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { saveAuthSession } from "../auth/session";
import { TactileButton } from "../components/TactileButton";
import { useLanguage } from "../i18n";

export function LoginPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);
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
        <form className="mt-6 space-y-4" onSubmit={(event) => void submit(event)}>
          <input value={username} onChange={(event) => setUsername(event.target.value)} className="w-full rounded-full bg-surface-container-lowest px-5 py-4 font-semibold outline-none" placeholder={t("usernameOrEmail")} autoComplete="username" />
          {mode === "register" && (
            <>
              <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="w-full rounded-full bg-surface-container-lowest px-5 py-4 font-semibold outline-none" placeholder={t("displayName")} autoComplete="name" />
              <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-full bg-surface-container-lowest px-5 py-4 font-semibold outline-none" placeholder={t("email")} autoComplete="email" type="email" />
            </>
          )}
          <input value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-full bg-surface-container-lowest px-5 py-4 font-semibold outline-none" placeholder={t("password")} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} />
          {mode === "register" && <p className="text-sm font-semibold text-on-surface-variant">{t("registerKeepsGuestHistory")}</p>}
          {error && <p className="rounded-lg bg-error/10 p-3 font-bold text-error">{error}</p>}
          <TactileButton className="w-full" disabled={loading}>{loading ? t("pleaseWait") : t("continue")}</TactileButton>
        </form>
      </section>
    </div>
  );
}
