// import Canvas from "@/app/components/Canvas";
import RoomCanvas from "@/app/components/Room/RoomCanvas";

export default async function CanvasPage({
  params,
  searchParams = {},
}: {
  params: { roomId: string };
  searchParams?: { [key: string]: string | undefined };
}) {
  const seachparams = await searchParams
  const roomId = (await params).roomId
  return <div className="h-full w-full bg-[#1E1E1E]">
    <RoomCanvas roomId={roomId} token={seachparams.token ?? ''} />
  </div>
}