export interface Env {
    DB: D1Database;
    KEYSTORE: KVNamespace;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    TURNSTILE: string;
    SITE_KEY: string;
}