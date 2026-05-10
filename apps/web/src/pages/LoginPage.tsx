import { TactileButton } from "../components/TactileButton";

export function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <section className="rounded-xl bg-surface-container-low p-6">
        <h1 className="text-3xl font-black">Log in</h1>
        <div className="mt-6 space-y-4">
          <input className="w-full rounded-full bg-surface-container-lowest px-5 py-4 font-semibold outline-none" placeholder="Email or phone" />
          <input className="w-full rounded-full bg-surface-container-lowest px-5 py-4 font-semibold outline-none" placeholder="Password" type="password" />
          <TactileButton className="w-full">Continue</TactileButton>
        </div>
      </section>
    </div>
  );
}

