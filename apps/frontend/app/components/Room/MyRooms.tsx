import { ExpandableCard } from '../ui/ExpandableCard';
import { client } from '@repo/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/options'

export async function fetchRooms(page: number) {
    try {
        const session = await getServerSession(authOptions);
        const rooms = await client.room.findMany({
            where: {
                adminid: Number(session?.user.id)
            },
            select: {
                id: true,
                slug: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: (page - 1) * 5,
            take: 5
        });
        const roomCount = await client.room.count({
            where: {
                adminid: Number(session?.user.id)
            },
        });
        return { rooms, roomCount };
    } catch (error) {
        console.log(error)
        return null
    }
}

export default async function MyRooms({ page }: { page: number }) {
    const data = await fetchRooms(page);
    return (
        <div className='z-50 relative h-full'>
            {
                data && data.rooms.length > 0 &&
                <div key={data.roomCount}>
                    <ExpandableCard cards={data.rooms} />
                    <div className='flex justify-center items-center gap-x-4 absolute bottom-40 right-50 w-full'>
                        {Array(Math.ceil(data.roomCount / 5)).fill(0).map((_, i) => <div className=''><a href={`/home?page=${i + 1}`} className={`${page == i + 1 ? 'bg-white text-black' : 'bg-black text-white'} border-white px-4 py-2 border rounded-md`}>{i + 1}</a></div>)}
                    </div>
                </div>
            }
        </div>
    )
}
export const dynamic = 'force-dynamic'