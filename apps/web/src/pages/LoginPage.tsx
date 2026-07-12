import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { saveAuthSession } from "../auth/session";
import { TactileButton } from "../components/TactileButton";
import { useLanguage } from "../i18n";
import logoWide from "../assets/login-logo-wide.png";
import mascotWhite from "../assets/login-mascot-white.png";
import mascotBlack from "../assets/login-mascot-black.png";
import wechatIcon from "../assets/login-wechat.png";
import qqIcon from "../assets/login-qq.png";
import confettiOne from "../assets/login-confetti-1.png";
import confettiTwo from "../assets/login-confetti-2.png";
import confettiThree from "../assets/login-confetti-3.png";
import confettiFour from "../assets/login-confetti-4.png";

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

  const submitLabel = loading ? t("pleaseWait") : mode === "forgot" ? (resetRequested ? t("resetPassword") : t("sendRecoveryInstructions")) : t("continue");

  return (
    <div className="mx-auto -mt-8 grid min-h-[calc(100vh-9rem)] w-full place-items-center">
      <section className="relative w-full max-w-[clamp(360px,52vw,560px)] overflow-hidden rounded-[2rem] bg-[#f0f0f0] shadow-[0_24px_80px_rgba(45,47,47,0.14)]">
        <div className="relative grid min-h-[260px] place-items-center overflow-hidden bg-gradient-to-br from-[#2b6c00] via-[#42b916] to-[#79ff32] px-6 py-10 text-white sm:min-h-[320px]">
          <img src={confettiOne} alt="" className="absolute left-[10%] top-[24%] w-12 opacity-90" />
          <img src={confettiTwo} alt="" className="absolute right-[20%] top-[20%] w-7 opacity-90" />
          <img src={confettiThree} alt="" className="absolute right-[14%] top-[45%] w-12 opacity-90" />
          <img src={confettiFour} alt="" className="absolute left-[22%] top-[12%] w-8 opacity-80" />
          <img src={logoWide} alt="DraughtsOne" className="relative z-10 h-auto w-72 max-w-[78%] drop-shadow-[0_8px_18px_rgba(0,0,0,0.16)]" />
          <img src={mascotWhite} alt="" className="absolute -bottom-8 left-4 hidden w-32 sm:block lg:w-40" />
          <img src={mascotBlack} alt="" className="absolute -bottom-10 right-3 hidden w-36 sm:block lg:w-44" />
        </div>

        <div className="px-6 py-7 sm:px-8">
          <div className="flex rounded-full bg-white p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]">
            <button type="button" onClick={() => switchMode("login")} className={`flex-1 rounded-full px-4 py-3 text-lg font-black transition ${mode === "login" || mode === "forgot" ? "bg-primary-fixed text-primary" : "text-on-surface"}`}>{t("login")}</button>
            <button type="button" onClick={() => switchMode("register")} className={`flex-1 rounded-full px-4 py-3 text-lg font-black transition ${mode === "register" ? "bg-primary-fixed text-primary" : "text-on-surface"}`}>{t("register")}</button>
          </div>
          {mode !== "register" && (
            <p className="mt-5 text-base font-black text-on-surface-variant">
              {mode === "forgot" ? t("forgotPasswordHelp") : t("loginHelp")}
            </p>
          )}
          <form className="mt-6 space-y-4" onSubmit={(event) => void submit(event)}>
          {mode !== "forgot" && (
            <input value={username} onChange={(event) => setUsername(event.target.value)} className="w-full rounded-full bg-white px-6 py-4 text-lg font-black outline-none placeholder:text-[#a7adba]" placeholder={t("usernameOrEmail")} autoComplete="username" />
          )}
          {mode === "register" && (
            <>
              <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="w-full rounded-full bg-white px-6 py-4 text-lg font-black outline-none placeholder:text-[#a7adba]" placeholder={t("displayName")} autoComplete="name" />
              <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-full bg-white px-6 py-4 text-lg font-black outline-none placeholder:text-[#a7adba]" placeholder={t("email")} autoComplete="email" type="email" />
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <input value={verificationCode} onChange={(event) => setVerificationCode(event.target.value)} className="w-full rounded-full bg-white px-6 py-4 text-lg font-black outline-none placeholder:text-[#a7adba]" placeholder={t("verificationCode")} inputMode="numeric" />
                <button type="button" onClick={() => void sendRegisterCode()} className="rounded-full bg-primary-fixed px-5 py-3 text-sm font-black text-primary">{t("sendCode")}</button>
              </div>
            </>
          )}
          {mode === "forgot" && (
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-full bg-white px-6 py-4 text-lg font-black outline-none placeholder:text-[#a7adba]" placeholder={t("emailOrUsername")} autoComplete="email" />
          )}
          {mode === "forgot" && resetRequested && (
            <>
              <input value={verificationCode} onChange={(event) => setVerificationCode(event.target.value)} className="w-full rounded-full bg-white px-6 py-4 text-lg font-black outline-none placeholder:text-[#a7adba]" placeholder={t("verificationCode")} inputMode="numeric" />
              <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="w-full rounded-full bg-white px-6 py-4 text-lg font-black outline-none placeholder:text-[#a7adba]" placeholder={t("newPassword")} type="password" autoComplete="new-password" />
            </>
          )}
          {mode !== "forgot" && (
            <input
              value={password}
              onBlur={() => setPasswordFocused(false)}
              onChange={(event) => setPassword(event.target.value)}
              onFocus={() => setPasswordFocused(true)}
              className="w-full rounded-full bg-white px-6 py-4 text-lg font-black outline-none placeholder:text-[#a7adba]"
              placeholder={t("password")}
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          )}
          {mode === "register" && passwordFocused && <p className="text-sm font-semibold text-on-surface-variant">{t("passwordRequirement")}</p>}
          {error && <p className="rounded-lg bg-error/10 p-3 font-bold text-error">{error}</p>}
          {message && <p className="rounded-lg bg-primary-fixed/40 p-3 font-bold text-primary">{message}</p>}
          {mode === "register" && message === t("loginInsteadSuggestion") && (
            <button type="button" onClick={() => { setUsername(email); switchMode("login"); }} className="w-full rounded-full bg-white px-5 py-3 font-black text-primary">
              {t("goToLogin")}
            </button>
          )}
          <TactileButton className="mt-3 w-full py-4 text-lg" disabled={loading}>{submitLabel}</TactileButton>
          </form>
          {mode === "login" && (
            <button type="button" onClick={() => switchMode("forgot")} className="mt-5 w-full text-center text-base font-black text-primary">
              {t("forgotPassword")}
            </button>
          )}
          {mode === "forgot" && (
            <button type="button" onClick={() => switchMode("login")} className="mt-5 w-full text-center text-base font-black text-primary">
              {t("backToLogin")}
            </button>
          )}
          <div className="mt-7 flex items-center gap-3 text-sm font-bold text-on-surface-variant">
            <span className="h-px flex-1 bg-[#cfd4cc]" />
            <span>{t("thirdPartyLogin")}</span>
            <span className="h-px flex-1 bg-[#cfd4cc]" />
          </div>
          <div className="mt-4 flex justify-center gap-6">
            <img src={wechatIcon} alt="WeChat" className="h-12 w-12" />
            <img src={qqIcon} alt="QQ" className="h-12 w-12" />
          </div>
        </div>
      </section>
    </div>
  );
}
