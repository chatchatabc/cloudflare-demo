# Compatibility for CMD

set shell := ["cmd.exe", "/c"]

compile-and-deploy:
    npm run build
    npx wrangler pages publish dist --node-compat

d1-init:
    npx wrangler d1 create "cloudflare_demo_db"
    npx wrangler d1 execute "cloudflare_demo_db" "CREATE TABLE IF NOT EXISTS users (email integer,password integer,id integer)