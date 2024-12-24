import { create } from 'zustand';
import { Course, Student, StudentCourseReport } from '@prisma/client';

interface StudentStore {
    students: Student[];
    setStudents: (students: Student[]) => void;
    fetchStudents: () => void;
    filterStudents: (coursename: string) => void;
}

export const useStudentStore = create<StudentStore>((set) => ({
    students: [],
    setStudents: (students) => set({ students }),
    fetchStudents: async () => {
        const students = await fetch('/api/fetchStudents').then((res) => res.json());
        set({ students });
    },
    filterStudents: async (coursename) => {
        const [students, courses, studentCourseReports] = await Promise.all([
            fetch('/api/fetchStudents').then((res) => res.json()),
            fetch('/api/fetchCourses').then((res) => res.json()),
            fetch('/api/fetchStudentCourse').then((res) => res.json())
        ]);
        const course = courses.find((course: Course) => course.name === coursename);
        if (!course) {
            set({ students: [] });
            return;
        }
        const filtered_students = students.filter((student: Student) => 
            studentCourseReports.some((report: StudentCourseReport) => 
                report.student_id === student.id && report.course_id === course.id
            )
        );
        set({ students: filtered_students });
    }
}));

interface CourseStore {
    courses: Course[];
    setCourses: (courses: Course[]) => void;
    fetchCourses: () => void;
    filterCourses: (search: string) => void;
}

export const useCourseStore = create<CourseStore>((set) => ({
    courses: [],
    setCourses: (courses) => set({ courses }),
    fetchCourses: async () => {
        const courses = await fetch('/api/fetchCourses').then((res) => res.json());
        set({ courses });
    },
    filterCourses: async (search) => {
        const res = await fetch('/api/fetchCourses');
        const courses = await res.json();
        const filtered_courses = courses.filter((course: Course) => course.name.toLowerCase().includes(search.toLowerCase()));
        set({ courses: filtered_courses });
    }
}));

interface ModalStore {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false })
}));