import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const addstudent = await request.json();
    console.log(addstudent);
    const { name, cohort, status, courses } = addstudent;
    console.log(name, cohort, status, courses);

    const student = await prisma.student.create({
      data: {
        name,
        cohort,
        status,
        StudentCourseReport: {
          create: courses.map((id: number) => ({
            Course: {
              connect: {
                id,
              },
            },
          })),
        },
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientRustPanicError ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    } else if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientInitializationError
    ) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unable to add student" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}