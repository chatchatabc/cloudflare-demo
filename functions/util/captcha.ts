import {Env} from "../model/Env";
import {fa} from "timeago.js/lib/lang";

export async function verifyChallenge(ip: string, challenge: string, secret: string): Promise<boolean> {
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const result = await fetch(url, {
        body: JSON.stringify({
            secret: secret,
            response: challenge,
            remoteip: ip,
        }),
        method: 'POST',
    });

    const outcome: {
        success: string,
        challenge_ts: string,
        hostname: string,
        "error-codes": String[],
        action: string,
        cdata: string,
    } = await result.json();

    return outcome.success == "true";
}