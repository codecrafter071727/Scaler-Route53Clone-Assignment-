"use client";

type Props = {
  open: boolean;
  message: string;
  onClose: () => void;
};

export function AccountCreatedPopup({ open, message, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-created-title"
        className="w-full max-w-sm rounded-xl border border-[#c6c6cd] bg-white p-5 shadow-lg"
      >
        <h2
          id="account-created-title"
          className="font-amazon-bold text-[18px] text-[#0f141a]"
        >
          Account created
        </h2>
        <p className="mt-2 text-[14px] leading-5 text-[#424650]">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-8 w-full rounded-full border border-[#ff9900] bg-[#ff9900] font-amazon-bold text-[14px] text-[#0f141a] hover:bg-[#ec7211]"
        >
          Continue to sign in
        </button>
      </div>
    </div>
  );
}
