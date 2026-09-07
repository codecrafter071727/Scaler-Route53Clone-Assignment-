import { AUTH_COPY } from "../data/auth-copy";

export function AuthFooter() {
  return (
    <footer className="pb-5 pt-8 text-center">
      <small className="text-[12px] leading-4 tracking-[0.06px] text-muted">
        {AUTH_COPY.copyright}
      </small>
    </footer>
  );
}
