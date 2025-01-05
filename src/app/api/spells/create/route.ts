"use server";
import { redirect } from "next/navigation";
export async function GET() {
  // console.log("Hello");

  return redirect("/homebrew");
}

export async function POST(req: Request) {
  // console.log(req);

  return redirect("/homebrew");
}
