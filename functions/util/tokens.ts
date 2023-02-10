import {Buffer} from "buffer";
import {User} from "../model/User";
import {Env} from "../model/Env";

const encoder = new TextEncoder();

const header = {
    alg: "HS256",
    typ: "JWT"
};

export async function verifyToken(id: string, token: string, secret: string): Promise<string | undefined> {
    if (!token) return undefined;

    const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");

    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        {name: "HMAC", hash: "SHA-256"},
        false,
        ["verify", "sign"]
    );

    const signature = Buffer.from(encodedSignature, "base64");

    let verified = await crypto.subtle.verify("HMAC", key, signature, encoder.encode(`${encodedHeader}.${encodedPayload}`));

    if (!verified) return undefined;

    const payload: User = JSON.parse(Buffer.from(encodedPayload, "base64").toString("utf-8"));

    return payload.id;
}

export async function generateToken(secret: string, identifier: string, expiry: number) {
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify", "sign"]
    );

    const payload = {
        id: identifier,
        iat: Math.floor(Date.now() / 1000),
        exp: expiry + Math.floor(Date.now() / 1000)
    };

    const encodedHeader: string = Buffer.from(encoder.encode(JSON.stringify(header))).toString("base64");
    const encodedPayload: string = Buffer.from(encoder.encode(JSON.stringify(payload))).toString("base64");

    const signature: ArrayBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(`${encodedHeader}.${encodedPayload}`));

    const encodedSignature: string = Buffer.from(signature).toString("base64");

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

export function clearTokens(message: string, status: number) {
    let response = new Response(message, {status: status});

    response.headers.append("Set-Cookie", "RT=; HttpOnly; Secure; SameSite=Strict; Max-Age=-1; Path=/",)
    response.headers.append("Set-Cookie", "AT=; HttpOnly; Secure; SameSite=Strict; Max-Age=-1; Path=/")
    response.headers.append("Set-Cookie", "ID=; Secure; SameSite=Strict; Max-Age=-1; Path=/")

    return response
}


export async function getAuth(cookie:  Record<string, string>, env: Env): Promise<{ id: string, needsRefresh: boolean }> {
    if (!cookie["ID"]) return {id: "", needsRefresh: false}

    let id = await verifyToken(cookie["ID"], cookie["AT"], env.JWT_SECRET)

    if (!id) {
        id = await verifyToken(cookie["ID"], cookie["RT"], env.JWT_REFRESH_SECRET)
        if (!id) return {id: "", needsRefresh: false}
        return {id: id, needsRefresh: true}
    }

    return {id: id, needsRefresh: false}
}
