import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const images = await db.query.images.findMany({
    orderBy: (model, {desc}) => desc(model.id)
  });
  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {[...images,  ...images].map((image, i) => (
          <div key={i} className="w-48 p-4">
            <img src={image.url} />
            <div>{image.name}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
