import { NextResponse } from "next/server";
import { seed } from "@/db/seed";

export async function GET() {
  try {
    await seed();
    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Seeding failed" }, { status: 500 });
  }
}
