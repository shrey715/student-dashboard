import { create } from 'zustand';
import { Course, Student, StudentCourseReport } from '@prisma/client';

// interface for the student store
interface StudentStore {
    students: Student[];
    setStudents: (students: Student[]) => void;
    fetchStudents: () => void;
    filterStudents: (coursename: string) => void;
}

// create the student store using zustand
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
        const filteredStudents = students.filter((student: Student) => 
            studentCourseReports.some((report: StudentCourseReport) => 
                report.student_id === student.id && report.course_id === course.id
            )
        );
        set({ students: filteredStudents });
    }
}));

// interface for the course store
interface CourseStore {
    courses: Course[];
    setCourses: (courses: Course[]) => void;
    fetchCourses: () => void;
    filterCourses: (search: string) => void;
}

// create the course store using zustand
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
        const filteredCourses = courses.filter((course: Course) => course.name.toLowerCase().includes(search.toLowerCase()));
        set({ courses: filteredCourses });
    }
}));

// interface for the modal store
interface ModalStore {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

// create the modal store using zustand
export const useModalStore = create<ModalStore>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false })
}));

// interface for the sidebar store
interface SidebarStore {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

// create the sidebar store using zustand
export const useSidebarStore = create<SidebarStore>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false })
}));

// interface for the class store
interface ClassStore {
    classes: string[];
    setClasses: (classes: string[]) => void;
    fetchClasses: () => void;
}

// create the class store using zustand
export const useClassStore = create<ClassStore>((set) => ({
    classes: [],
    setClasses: (classes) => set({ classes }),
    fetchClasses: async () => {
        const courses = await fetch('/api/fetchCourses').then((res) => res.json());
        const classes: string[] = courses.map((course: Course) => {
            const className = course.name.split(' ').slice(0, 2).join(' ');
            return className;
        });
        set({ classes: [...new Set(classes)] }); // remove duplicates
    }
}));