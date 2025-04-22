import axios from "axios";
import { headers } from "next/headers";
import { Room } from "../types/types";
import MyRooms from "../components/Room/MyRooms";
import { DotBackground } from "../components/ui/DotBackground";

export async function fetchRooms() {
    const headersList = await headers();
    const cookie = headersList.get('cookie');
    try {
        const rooms = await axios.get(`${process.env.NEXTAUTH_URL}/api/rooms`, {
            headers: {
                Cookie: cookie
            }
        })
        return rooms.data.rooms;
    } catch (error) {
        console.log(error);
        return []
    }
}

export default async function MyRoomsPage() {
    const myRooms: Room[] = await fetchRooms();
    return (
        <>
            <DotBackground>
                <p className="text-left px-10 text-white font-semibold font-serif text-5xl mt-10">My Rooms</p>
                <div className="text-white bg-transparent grid grid-cols-4 gap-x-5 p-4" >
                    <MyRooms rooms={myRooms}/>
                </div>
            </DotBackground>
        </>
    )
}