import {parse} from "cookie"
import {Env} from "../../model/Env";
import {clearTokens, generateToken, getAuth} from "../../util/tokens";
import {User} from "../../model/User";
import {Password} from "../../model/Password";

// @ts-ignore
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const cookie = parse(context.request.headers.get('Cookie') || '');

    const auth = await getAuth(cookie, context.env)
    let headers = new Headers()
    let body: string;

    if (!auth.id) {
        return clearTokens("Please log in again.",  401)
    }

    if (auth.needsRefresh) {
        let token = await generateToken(context.env.JWT_SECRET, auth.id, 3600)
        headers.append("Set-Cookie", "AT=" + token + "; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/")
    }

    let user = await context.env.DB.prepare("SELECT * FROM users WHERE id = ? LIMIT 1").bind(auth.id).first<User>()

    let passwords: Password[] | null = await context.env.KEYSTORE.get<Password[]>(user.id, "json")

    if (passwords == null) {
        passwords = []
    }

    let passwordId = context.request.url.split("/").pop()

    let key: Password = passwords!!.filter((password) => password.id == passwordId)[0]

    if (!key) {
        body = "Password not found."
        headers.append("status", "404")
    }

    const values: Password = await context.request.json();

    console.log(values)

    key.username = values.username
    key._for = values._for
    key.description = values.description
    key.password = values.password
    key.updatedAt = Date.now()

    let newKeys = passwords!!.filter((password) => password.id != passwordId)
    newKeys.push(key)

    await context.env.KEYSTORE.put(user.id, JSON.stringify(newKeys))

    return new Response("Successfully edited key!", {headers: headers, status: 200})
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const cookie = parse(context.request.headers.get('Cookie') || '');

    const auth = await getAuth(cookie, context.env)
    let headers = new Headers()
    let body: string;

    if (!auth.id) {
        return clearTokens("Please log in again.",  401)
    }

    if (auth.needsRefresh) {
        let token = await generateToken(context.env.JWT_SECRET, auth.id, 3600)
        headers.append("Set-Cookie", "AT=" + token + "; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/")
    }

    let user = await context.env.DB.prepare("SELECT * FROM users WHERE id = ? LIMIT 1").bind(auth.id).first<User>()

    let passwords: Password[] | null = await context.env.KEYSTORE.get<Password[]>(user.id, "json")

    if (passwords == null) {
        passwords = []
    }

    console.log("URL: " + context.request.url)

    for (let password of context.request.url.split("/")!!) {
        console.log("splitting")
    }

    let passwordId = context.request.url.split("/").pop()!!

    console.log("Getting password for id: " + passwordId)

    let key = passwords!!.filter((password) => password.id == passwordId).pop()

    if (key === undefined) {
        body = "Password not found."
        headers.append("status", "404")
    } else {
        body = JSON.stringify(key)
    }

    return new Response(body, {headers: headers})
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const cookie = parse(context.request.headers.get('Cookie') || '');

    const auth = await getAuth(cookie, context.env)
    let headers = new Headers()
    let body: string;

    if (!auth.id) {
        return clearTokens("Please log in again.",  401)
    }

    if (auth.needsRefresh) {
        let token = await generateToken(context.env.JWT_SECRET, auth.id, 3600)
        headers.append("Set-Cookie", "AT=" + token + "; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/")
    }

    let user = await context.env.DB.prepare("SELECT * FROM users WHERE id = ? LIMIT 1").bind(auth.id).first<User>()

    let passwords: Password[] | null = await context.env.KEYSTORE.get<Password[]>(user.id, "json")

    console.log("Passwords before: " + passwords?.length)

    if (passwords == null) {
        passwords = []
    }

    let passwordId = context.request.url.split("/").pop()!!

    let newKeys = passwords!!.filter((password) => password.id != passwordId)

    console.log("Passwords after: " + newKeys.length)

    console.log("Deleted password for id: " + passwordId)

    await context.env.KEYSTORE.put(user.id, JSON.stringify(newKeys))

    return new Response("Successfully deleted entry!", {headers: headers, status: 200})
}

