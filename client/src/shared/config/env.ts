function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not set. Add it to client/.env.local`);
  }
  return value;
}

export const clientEnv = {
  apiUrl: requireEnv("NEXT_PUBLIC_API_URL"),
  afterAuthPath: requireEnv("NEXT_PUBLIC_AFTER_AUTH_PATH"),
};
