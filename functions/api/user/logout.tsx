import {Env} from "../../model/Env";
import {clearTokens} from "../../util/tokens";

// @ts-ignore
export const onRequestPost: PagesFunction<Env> = async (context) => {
    return clearTokens("Successfully logged out!", 200)
}