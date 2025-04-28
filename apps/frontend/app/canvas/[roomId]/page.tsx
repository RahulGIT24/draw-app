import RoomCanvas from "@/app/components/Room/RoomCanvas";

export default async function CanvasPage({
  params,
  searchParams = undefined,
}: {
  params: Promise<{ roomId: string }>;
  searchParams?: Promise<any> | undefined;
}) {
  const { roomId } = await params;
  const resolvedSearchParams = await searchParams;
  const token = resolvedSearchParams?.token;

  return (
    <div className="h-full w-full bg-[#1E1E1E]">
      <RoomCanvas roomId={roomId} token={token ?? ''} />
    </div>
  );
}
