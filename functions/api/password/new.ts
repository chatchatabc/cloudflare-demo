import {Env} from "../../model/Env";
import {parse} from "cookie";
import {clearTokens, generateToken, getAuth} from "../../util/tokens";
import {User} from "../../model/User";
import {Password} from "../../model/Password";
import {v4 as uuidv4} from "uuid"

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const cookie = parse(context.request.headers.get('Cookie') || '');

    const auth = await getAuth(cookie, context.env)
    let headers = new Headers()
    let body: string;

    if (!auth.id) {
        return clearTokens("Please log in again.", 401)
    }

    if (auth.needsRefresh) {
        let token = await generateToken(context.env.JWT_SECRET, auth.id, 3600)
        headers.append("Set-Cookie", "AT=" + token + "; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/")
    }

    console.log("Auth: " + auth.id)

    console.log("Preparing to query database")

    let user = await context.env.DB.prepare("SELECT * FROM users WHERE id = ? LIMIT 1").bind(auth.id).first<User>()

    console.log("User: " + user.id)
    console.log("Preparing to access KV")

    let passwords: Password[] | null = await context.env.KEYSTORE.get<Password[]>(user.id, "json")

    if (passwords == null) {
        passwords = []
    }

    const values: Password = await context.request.json();

    values.id = uuidv4()
    values.createdAt = Date.now()
    values.updatedAt = Date.now()

    passwords.push(values)

    await context.env.KEYSTORE.put(user.id, JSON.stringify(passwords))

    return new Response("Successfully added key!", {headers: headers, status: 200})
}