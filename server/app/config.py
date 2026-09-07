from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Scaler Assignment API"
    api_prefix: str = "/api"
    database_url: str = "sqlite:///./app.db"
    cors_origins: str = "http://localhost:3000"

    session_cookie_name: str = "session_token"
    session_max_age_seconds: int = 60 * 60 * 24 * 7
    cookie_secure: bool = False
    cookie_samesite: str = "lax"
    cookie_domain: str | None = None

    password_min_length: int = 8

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
