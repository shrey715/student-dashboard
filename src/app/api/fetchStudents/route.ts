import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

async function fetchStudents() {
    const prisma = new PrismaClient();
    try {
        const students = await prisma.student.findMany({
            include: {
                StudentCourseReport: {
                    include: {
                        Course: true,
                    },
                },
            },
        });
        return students;
    } catch (error) {
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET() {
    try {
        const students = await fetchStudents();
        return NextResponse.json(students);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Unable to fetch students" }, { status: 500 });
    }
}