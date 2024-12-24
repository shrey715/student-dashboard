import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";

export async function POST(request: NextRequest){
  const prisma = new PrismaClient();
  try{
    const {name, cohort, status, courseIds} = await request.json();
    const student = await prisma.student.create({
      data: {
        name,
        cohort,
        status,
        StudentCourseReport: {
          create: courseIds.map((id: number) => ({
            Course: {
              connect: {
                id,
              },
            },
          })),
        },
      },
    });
    return NextResponse.json(student, {status: 201});
  }catch(error){
    if (error instanceof Prisma.PrismaClientKnownRequestError){
      return NextResponse.json({error: error.message}, {status: 400});
    }
  }finally{
    await prisma.$disconnect();
  }
} 