# Cloudflare Demo App

This demo app is deployed on Cloudflare Pages! [Take a look at it here.](https://cloudflare-demo-572.pages.dev/)

This project is a demo app that tries to utilize as much of the Cloudflare infrastructure and services as possible.
It is a simple web app that allows users to store and retrieve passwords.

This is a completely serverless app, meaning that there is no backend server that is running.

**NOTE: This is not a secure app**. This is only meant to highlight Cloudflare services. Security is not a priority.
Please **do not** store your real passwords.

# Cloudflare Features Used

### **Cloudflare Pages**

Cloudflare Pages is a static site hosting service that allows you to deploy your static sites on Cloudflare, leveraging
their extensive edge network to deliver your site to your users with extremely low latency and fast
load times.

### **Cloudflare Pages Functions**

Cloudflare Pages Functions is a serverless function service that allows you to deploy serverless functions on
Cloudflare's global network. It allows you to create dynamic sites that are completely serverless, meaning that there is no
backend server that is running. It will also allow you to create dynamic sites that can be updated without having to
redeploy the entire site.

### **D1 (Serverless Databases)**

> This service is currently in **ALPHA**. It is not recommended to use this in production.

D1 is a serverless database service that allows you to store data in a SQL database without having to manage a database
server.

### **Workers KV (Key-Value Store)**

Workers KV is a key-value store that allows you to store data in a global key-value store without having to manage a
database server and
is accessible from anywhere in the world with low latency.

### **Wrangler (Cloudflare Workers CLI)**

Wrangler is a tool that allows you to deploy Cloudflare Workers and Cloudflare Pages Functions from the commandline.
This tool also lets you manage Cloudflare infrastructure and services like Workers KV and D1 from the commandline.

# Deploying in Cloudflare Pages

This app is already deployed on Cloudflare Pages. You can view it [here](https://cloudflare-demo-572.pages.dev/).
If you wish to deploy it yourself, you can do so by following the steps below.

## Prerequisites

- A Cloudflare account

### Setting up Cloudflare and Wrangler

1. Install [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
2. Run `wrangler login` and follow the instructions to log in to your Cloudflare account

### Deploying the App

1. Clone this repo and `cd` into it
2. Run `npm install`
3. Build the app by running `npm run build`
4. Deploy the app by running `npx wrangler pages publish dist`.
   Follow the instructions to set up your Cloudflare account and the Pages project if you haven't already.

   The app will be deployed to a random subdomain of `pages.dev`.
   You can view the app by going to the URL that is printed in the terminal.

> Alternatively, if you have *just* installed, you can run `just compile-and-deploy` to compile and deploy the app in
> one command. This will also instruct you to set up your Cloudflare account and the Pages project if you haven't
> already.

### To-do

- [ ] Client-side encryption (Zero-Knowledge Architecture)
- [ ] Use React Router
- [ ] Better API return values
- [ ] Optimize for mobile
    - There is *some* compatibility, but it is not very optimized for mobile.
- [ ] More consistent animations for modals and popups
- [ ] Use Cloudflare R2 for image assets
- [ ] Use Cloudflare Service Worker with cron for periodic password checkup
- [ ] Better error handling
