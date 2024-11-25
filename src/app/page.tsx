import Link from "next/link";
import { db } from "~/server/db";

const mockUrls = [
  "https://utfs.io/f/NVg4SuAMkB5d97xKL8a37SgeYP5ujEc8vbsfHaNJIM6zXTVy",
  "https://utfs.io/f/NVg4SuAMkB5dLZQIuHDyl0yqV5XMAi9oKwPETmZaBOkuUjS6",
  "https://utfs.io/f/NVg4SuAMkB5dE33UuujnVL39BqIDAaGcxovwW7k5sQpeHP1F",
  "https://utfs.io/f/NVg4SuAMkB5dDJpHNyXF7SXkHClOrA9VBqvYoxLZGQJM4aed",
  "https://utfs.io/f/NVg4SuAMkB5d48rJhEISOHPaY5muMTnEK1Dwb9ZU6NvRXJjA",
]

const mockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url
}))

export default async function HomePage() {
  const posts = await db.query.posts.findMany()
  console.log(posts)
  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
      {posts.map(post => (<div key={post.id}>
        {post.name}
      </div>))}
      {
        [...mockImages,...mockImages,  ...mockImages].map((image, i) => (
          <div key={i} className="w-48 p-4">
            <img src={image.url} />
          </div>
        ))
      }</div>
    </main>
  );
}
