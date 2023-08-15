import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ data: "Hello World" });
}

export const revalidate = 0;
