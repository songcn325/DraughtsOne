import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { saveAuthSession } from "../auth/session";
import draughtsOneLogo from "../assets/draughtsone-logo-white.png";
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
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetRequested, setResetRequested] = useState(false);
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
      const response = resetRequested
        ? await api.confirmPasswordReset(target.includes("@") ? { email: target, code: verificationCode, newPassword } : { username: target, code: verificationCode, newPassword })
        : await api.requestPasswordReset(target.includes("@") ? { email: target } : { username: target });
      setLoading(false);
      if (!response.ok) {
        setError(response.error.message);
        return;
      }
      if ("passwordReset" in response.data) {
        setMessage(t("passwordResetComplete"));
        setResetRequested(false);
        setMode("login");
        return;
      }
      setResetRequested(true);
      setMessage(response.data.supportedInCurrentMvp ? t("passwordResetSent") : t("passwordResetNotEnabled"));
      return;
    }

    const response = mode === "login"
      ? await api.login({ username, password })
      : await api.register({ username, password, displayName, email, verification: { channel: "email", target: email, code: verificationCode } });
    setLoading(false);

    if (!response.ok) {
      setError(response.error.message);
      if (mode === "register" && response.error.details?.loginInstead) {
        setMessage(t("loginInsteadSuggestion"));
      }
      return;
    }

    saveAuthSession(response.data);
    navigate("/profile");
  }

  async function sendRegisterCode() {
    setLoading(true);
    setError(undefined);
    setMessage(undefined);
    const response = await api.sendVerificationCode({ channel: "email", target: email, purpose: "register" });
    setLoading(false);
    if (!response.ok) {
      setError(response.error.message);
      return;
    }
    setMessage(response.data.supportedInCurrentMvp ? t("verificationCodeSent") : t("emailServiceNotConfigured"));
  }

  function switchMode(nextMode: "login" | "register" | "forgot") {
    setMode(nextMode);
    setError(undefined);
    setMessage(undefined);
    setResetRequested(false);
  }

  return (
    <div className="mx-auto -mt-8 grid min-h-[calc(100vh-9rem)] max-w-md place-items-center">
      <section className="w-full overflow-hidden rounded-[2rem] bg-surface-container-low shadow-[0_24px_80px_rgba(45,47,47,0.12)]">
        <div className="grid place-items-center bg-gradient-to-br from-primary to-[#78f235] px-6 py-10 text-white">
          <img src={draughtsOneLogo} alt="DraughtsOne" className="h-auto w-64 max-w-[82%] drop-shadow-[0_8px_18px_rgba(0,0,0,0.16)]" />
        </div>
        <div className="p-6">
        <div className="flex rounded-full bg-surface-container-lowest p-1">
          <button type="button" onClick={() => switchMode("login")} className={`flex-1 rounded-full px-4 py-2 font-black ${mode === "login" ? "bg-primary-fixed text-primary" : ""}`}>{t("login")}</button>
          <button type="button" onClick={() => switchMode("register")} className={`flex-1 rounded-full px-4 py-2 font-black ${mode === "register" ? "bg-primary-fixed text-primary" : ""}`}>{t("register")}</button>
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
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <input value={verificationCode} onChange={(event) => setVerificationCode(event.target.value)} className="w-full rounded-full bg-surface-container-lowest px-5 py-4 font-semibold outline-none" placeholder={t("verificationCode")} inputMode="numeric" />
                <button type="button" onClick={() => void sendRegisterCode()} className="rounded-full bg-primary-fixed px-4 py-3 text-sm font-black text-primary">{t("sendCode")}</button>
              </div>
            </>
          )}
          {mode === "forgot" && (
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-full bg-surface-container-lowest px-5 py-4 font-semibold outline-none" placeholder={t("emailOrUsername")} autoComplete="email" />
          )}
          {mode === "forgot" && resetRequested && (
            <>
              <input value={verificationCode} onChange={(event) => setVerificationCode(event.target.value)} className="w-full rounded-full bg-surface-container-lowest px-5 py-4 font-semibold outline-none" placeholder={t("verificationCode")} inputMode="numeric" />
              <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="w-full rounded-full bg-surface-container-lowest px-5 py-4 font-semibold outline-none" placeholder={t("newPassword")} type="password" autoComplete="new-password" />
            </>
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
          {mode === "register" && message === t("loginInsteadSuggestion") && (
            <button type="button" onClick={() => { setUsername(email); switchMode("login"); }} className="w-full rounded-full bg-surface-container-lowest px-5 py-3 font-black text-primary">
              {t("goToLogin")}
            </button>
          )}
          <TactileButton className="w-full" disabled={loading}>{loading ? t("pleaseWait") : mode === "forgot" ? (resetRequested ? t("resetPassword") : t("sendRecoveryInstructions")) : t("continue")}</TactileButton>
        </form>
        {mode === "login" && (
          <button type="button" onClick={() => switchMode("forgot")} className="mt-5 w-full text-center text-sm font-black text-primary">
            {t("forgotPassword")}
          </button>
        )}
        {mode === "forgot" && (
          <button type="button" onClick={() => switchMode("login")} className="mt-5 w-full text-center text-sm font-black text-primary">
            {t("backToLogin")}
          </button>
        )}
        </div>
      </section>
    </div>
  );
}
