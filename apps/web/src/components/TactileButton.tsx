import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  tone?: "primary" | "secondary" | "surface" | "danger";
};

const tones = {
  primary: "bg-primary-fixed text-[#1a4700] shadow-[0_6px_0_#235b00]",
  secondary: "bg-secondary-fixed text-[#423200] shadow-[0_6px_0_#644c00]",
  surface: "bg-surface-container-lowest text-on-surface shadow-[0_6px_0_#dbdddd]",
  danger: "bg-error text-white shadow-[0_6px_0_#7f1a00]"
};

export function TactileButton({ tone = "primary", className = "", children, ...props }: Props) {
  return (
    <button className={`btn-3d inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-black ${tones[tone]} ${className}`} {...props}>
      {children}
    </button>
  );
}

