import { client } from "@repo/db/prisma";

export async function checkUser(token: string): Promise<number | null> {
    try {
        const user = await client.user.findFirst({
            where: {
                userToken: token
            }
        })

        if (user) {
            return user.id
        }

        return null;

    } catch (error) {
        return null
    }
}