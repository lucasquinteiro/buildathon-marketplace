import Products from "@/modules/Products";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <Products />
    </main>
  );
}
