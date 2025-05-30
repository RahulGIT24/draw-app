import axios from "axios";
import Canvas from "../Canvas";
import RedirectionButton from "./RedirectionButton";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/options";

const validateRoom = async ({ roomId, token }: { roomId: string; token?: string }) => {
    try {
        const headersList = await headers();
        const cookie = headersList.get("cookie");

        let url = `${process.env.NEXTAUTH_URL}/api/room/${roomId}`;
        if (token) {
            url += `?token=${token}`;
        }

        const res = await axios.get(url, {
            headers: {
                Cookie: cookie,
            },
        });
        const isCollaboration = res.data.room.collaboration;
        const collaborationToken = res.data.room.collaborationToken;
        const valid = true;
        const isAdmin = res.data.isAdmin;

        return { isCollaboration, valid, collaborationToken, isAdmin };
    } catch (error: any) {
        console.log(error)
        return null;
    }
};

export default async function RoomCanvas({ roomId, token }: { roomId: string, token: string }) {

    const res = await validateRoom({ roomId: roomId, token });
    const session = await getServerSession(authOptions);
    const userToken = session?.user.userToken;

    if ((res == null || res.valid === false) && token) {
        return (
            <div className="h-screen w-full flex justify-center flex-col gap-y-7 items-center bg-zinc-800 text-white font-bold text-3xl">
                <p>Collaboration is turned off for this room</p>
                <RedirectionButton link={`/`} text="Go Back" />
            </div>
        );
    }

    if(res == null || res.valid === false){
        return (
            <div className="h-screen w-full flex justify-center flex-col gap-y-7 items-center bg-zinc-800 text-white font-bold text-3xl">
                <p>Invalid Room URL</p>
                <RedirectionButton link={`/`} text="Go Back" />
            </div>
        )
    }

    return (
        userToken &&
        <Canvas
            isAdmin={res.isAdmin}
            roomId={roomId}
            userToken={userToken}
            IsCollaborating={res.isCollaboration}
            collaborationToken={res.collaborationToken}
        />
    );
}

