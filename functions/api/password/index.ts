import {parse} from "cookie"
import {Env} from "../../model/Env";
import {clearTokens, generateToken, getAuth, verifyToken} from "../../util/tokens";
import {User} from "../../model/User";
import {Password} from "../../model/Password";

// @ts-ignore
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

    console.log("Preparing to get passwords from D1")

    let user = await context.env.DB.prepare("SELECT * FROM users WHERE id = ? LIMIT 1").bind(auth.id).first<User>()

    console.log("Found user: " + user.id)

    let passwords: Password[] | null = await context.env.KEYSTORE.get<Password[]>(user.id, "json")

    console.log("Found passwords: " + passwords!!.length)

    if (passwords == null) {
        console.log("Passwords are null, setting to empty array")
        passwords = []
    }

    console.log("Preparing to cleanup return data")

    // Clear password data
    passwords = passwords.map((password) => {
        console.log("Clearing password data for " + password._for)
        password.password = ""
        return password
    })

    body = JSON.stringify(passwords)

    console.log("Returning passwords: " + body)

    return new Response(body, {headers: headers, status: 200})
}