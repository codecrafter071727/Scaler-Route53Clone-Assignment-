function requireEnv(name: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`${name} is not set. Add it to client/.env.local`);
  }
  return trimmed;
}

/** Must read NEXT_PUBLIC_* via static `process.env.X` so Next.js can inline them. */
export const clientEnv = {
  apiUrl: requireEnv("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL),
  afterAuthPath: requireEnv(
    "NEXT_PUBLIC_AFTER_AUTH_PATH",
    process.env.NEXT_PUBLIC_AFTER_AUTH_PATH,
  ),
  loginPath: requireEnv(
    "NEXT_PUBLIC_LOGIN_PATH",
    process.env.NEXT_PUBLIC_LOGIN_PATH,
  ),
};
