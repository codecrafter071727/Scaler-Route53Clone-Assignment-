"use client";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AccountCreatedDialog({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-created-title"
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-lg"
      >
        <h2
          id="account-created-title"
          className="font-amazon-bold text-[18px] text-foreground"
        >
          Account created
        </h2>
        <p className="mt-2 text-[14px] leading-5 text-sidebar-text">
          Your account was created successfully. Sign in with your email or phone
          and password to continue.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-9 w-full rounded-full border border-aws-orange bg-aws-orange font-amazon-bold text-[14px] text-on-orange hover:bg-aws-orange-hover"
        >
          Continue to sign in
        </button>
      </div>
    </div>
  );
}
