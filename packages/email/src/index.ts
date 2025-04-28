import redis from "@repo/cache/cache"
import { IEmail } from "@repo/common/types";
import { EMAIL_QUEUE } from "@repo/common/config";

export async function pushToEmailQueue(args: IEmail) {
    try {
        const { subject, token } = args;
        const toSave = {
            subject, token
        }
        await redis.lpush(EMAIL_QUEUE,JSON.stringify(toSave));
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}