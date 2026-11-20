/** Buttons and button-styled links. `sun` = the one red accent, `ghost` = outline, `paper` = for light sections. */
import type { ReactNode, MouseEventHandler } from "react";

type Common = { children: ReactNode; variant?: "sun" | "ghost" | "paper"; className?: string; icon?: ReactNode };
type LinkProps = Common & { href: string; external?: boolean; onClick?: MouseEventHandler<HTMLAnchorElement> };
type BtnProps = Common & { href?: undefined; type?: "button" | "submit"; onClick?: MouseEventHandler<HTMLButtonElement>; disabled?: boolean };

export default function Button(props: LinkProps | BtnProps) {
  const { children, variant = "sun", className = "", icon } = props;
  const cls = `btn btn-${variant} ${className}`;
  const inner = (
    <>
      {icon && <span aria-hidden className="btn-icon">{icon}</span>}
      <span>{children}</span>
    </>
  );
  if (props.href !== undefined) {
    const ext = props.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
    return (
      <a href={props.href} className={cls} onClick={props.onClick} {...ext}>
        {inner}
      </a>
    );
  }
  return (
    <button type={props.type ?? "button"} className={cls} onClick={props.onClick} disabled={props.disabled}>
      {inner}
    </button>
  );
}

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" className={className} aria-hidden fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.1-.1Z" />
    </svg>
  );
}
