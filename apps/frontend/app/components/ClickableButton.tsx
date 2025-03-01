import { Button } from "@repo/ui/button";

export default function ClickableButton({isCollaborating,toogleCollaboration}:{isCollaborating:boolean,toogleCollaboration:()=>void}){
    return (
        <Button text={!isCollaborating ? "Start Collaboration" : "Stop Collaboration"} classname="bg-white text-zinc-800 border border-zinc-800 hover:text-white hover:bg-zinc-800" onClick={toogleCollaboration} />
    )
}