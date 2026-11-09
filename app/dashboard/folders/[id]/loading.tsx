import { Block } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10" aria-busy="true">
      <Block className="h-4 w-40 rounded-md" />
      <Block className="mt-4 h-10 w-72 rounded-lg" />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Block key={i} className="aspect-[4/3] rounded-[18px]" />
        ))}
      </div>
    </main>
  );
}
