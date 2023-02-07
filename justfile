# Compatibility for CMD

set shell := ["cmd.exe", "/c"]

compile-and-deploy:
    npm run build
    npx wrangler pages publish dist --node-compat
