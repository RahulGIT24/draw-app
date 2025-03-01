import axios from "axios";
import Canvas from "../Canvas";
import RedirectionButton from "./RedirectionButton";
import { headers } from "next/headers";

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
        console.log(res.data);
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

export default async function RoomCanvas({roomId,token}:{roomId:string,token:string}) {

    const res = await validateRoom({ roomId: roomId, token });

    if (res == null || res.valid === false) {
        return (
            <div className="h-screen w-full flex justify-center flex-col gap-y-7 items-center bg-zinc-800 text-white font-bold text-3xl">
                <p>Invalid Joining URL or Room Not Exists</p>
                <RedirectionButton link={`/`} text="Go Back" />
            </div>
        );
    }

    return (
        <Canvas
            isAdmin={res.isAdmin}
            roomId={roomId}
            IsCollaborating={res.isCollaboration}
            collaborationToken={res.collaborationToken}
        />
    );
}

