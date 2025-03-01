import Canvas from "./Canvas";

export default function ParentCanvas({isAdmin,roomId,collaborationToken,isCollaboration}:{
    isAdmin:boolean,
    roomId:string,
    collaborationToken:string,
    isCollaboration:boolean
}) {
    return (
        <Canvas
            isAdmin={isAdmin}
            roomId={roomId}
            IsCollaborating={isCollaboration}
            collaborationToken={collaborationToken}
        />
    )
}