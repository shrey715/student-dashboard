import { Prisma, PrismaClient, Course } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const course: Course = await req.json();
    const newCourse = await prisma.course.create({
      data: course,
    });
    return NextResponse.json(newCourse);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    } else if (error instanceof Prisma.PrismaClientValidationError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to add course" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}