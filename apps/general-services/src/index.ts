import { client } from '@repo/db/prisma'
import cron from 'node-cron'

async function cleanUp() {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        await client.user.deleteMany({
            where: {
                createdAt: thirtyDaysAgo,
                verified: false
            }
        })
        console.log('Cleanup done');
    } catch (error) {
        console.log("Error while Cleaning Users: ", error);
    }
}

cron.schedule('0 */24 * * *', () => {
    cleanUp();
});
