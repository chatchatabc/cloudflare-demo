import {PagesFunction} from "@cloudflare/workers-types";
import {D1Database} from "@cloudflare/workers-types";
import {SHA512} from "crypto-js";
import CryptoJS from "crypto-js";
import {v4 as uuidv4} from "uuid"
import {User} from "../../model/User";
import {Env} from "../../model/Env";
import {verifyChallenge} from "../../util/captcha";

// @ts-ignore
export const onRequestPost: PagesFunction<Env> = async (context) => {
    let {email, password, challenge} = await context.request.json<{
        email: string, password: string, challenge: string
    }>();

    const ip: string = context.request.headers.get('CF-Connecting-IP')!!;

    let verified = await verifyChallenge(ip, challenge, context.env.TURNSTILE);

    if (!verified) {
        return new Response("Invalid challenge.", {status: 400});
    }

    if (!email || !password) {
        return new Response("Email or password is missing", {status: 400});
    }

    // noinspection ES6RedundantAwait
    let user = await context.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).all<User>()

    if (user.results?.length != 0) {
        return new Response("User already exists", {status: 400});
    }

    let hashed = SHA512(password).toString(CryptoJS.enc.Hex);

    let id = uuidv4();

    let result = await context.env.DB.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)").bind(id, email, hashed).run();

    if (result.error) {
        return new Response("Error creating account. Please try again.", {status: 500});
    }

    console.log(JSON.stringify([]))

    await context.env.KEYSTORE.put(id, JSON.stringify([]));

    return new Response(`User created! Please click login below`, {status: 201});
}
