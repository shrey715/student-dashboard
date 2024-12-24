import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function fetchStudentCourse(){
    const prisma = new PrismaClient();
    try {
        const courses = await prisma.studentCourseReport.findMany();
        return courses;
    } catch (error) {
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
    
export async function GET(){
    try{
        const courses = await fetchStudentCourse();
        return NextResponse.json(courses);
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Unable to fetch courses"}, {status: 500});
    }
}