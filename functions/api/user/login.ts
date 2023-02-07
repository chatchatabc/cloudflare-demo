import {PagesFunction} from "@cloudflare/workers-types";
import {SHA512} from "crypto-js";
import CryptoJS from "crypto-js";
import {User} from "../../model/User";
import {Env} from "../../model/Env";
import {generateToken} from "../../util/tokens";

// @ts-ignore
export const onRequestPost: PagesFunction<Env> = async (context) => {
    let {email, password} = await context.request.json<User>();

    if (!email || !password) {
        return new Response("Email or password is missing", {status: 400});
    }

    let user = await context.env.DB.prepare("SELECT * FROM users WHERE email = ? LIMIT 1").bind(email).first<User>()


    if (user == null) {
        return new Response("Invalid email or password.", {status: 400});
    }

    let hashed = SHA512(password).toString(CryptoJS.enc.Hex);
    if (hashed != user.password) {
        return new Response("Invalid email or password.", {status: 400});
    }

    let token: string = await generateToken(context.env.JWT_SECRET, user.id, 3600); // 1 hour
    let refresh_token: string = await generateToken(context.env.JWT_REFRESH_SECRET, user.id, 2592000) // 1 month

    let response = new Response("Login successful!", {
        headers: {"Content-Type": "application/json"}
    });

    response.headers.append("Set-Cookie", "RT=" + refresh_token + "; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000; Path=/",)
    response.headers.append("Set-Cookie", "AT=" + token + "; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/")
    response.headers.append("Set-Cookie", "ID=" + user.id + "; Secure; SameSite=Strict; Max-Age=2592000; Path=/")

    return response;
}