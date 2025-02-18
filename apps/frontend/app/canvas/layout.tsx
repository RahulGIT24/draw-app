export const metadata = {
  title: "Canvas Mode",
  description: "Collaborative Drawing Space",
};

export default function CanvasLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="bg-white w-full h-screen">{children}</div>;
}
