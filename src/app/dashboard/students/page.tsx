"use client";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import StudentModal from "@/components/ui/studentmodal";
import { Plus } from "lucide-react";
import { FaCircle } from 'react-icons/fa';
import { Student, StudentStatus } from '@prisma/client';
import { useStudentStore, useModalStore, useClassStore } from "@/lib/zustand-store";
import { useEffect, useState } from "react";
import { StudentCourseReport, Course } from "@prisma/client";

const TableControl = ({ onFilterChange }: { onFilterChange: (cohort: string, className: string) => void }) => {
  const { open } = useModalStore();
  const { students } = useStudentStore();
  const { classes, fetchClasses } = useClassStore();
  const [selectedCohort, setSelectedCohort] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const cohorts = students.map((student) => student.cohort);
  const uniqueCohorts = [...new Set(cohorts)];

  useEffect(() => {
    onFilterChange(selectedCohort, selectedClass);
  }, [selectedCohort, selectedClass, onFilterChange]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full mb-4">
      <div className="flex flex-col md:flex-row justify-start items-center gap-3 font-semibold w-full md:w-auto">
        <Select onValueChange={setSelectedCohort}>
          <SelectTrigger className="bg-gray-200 dark:bg-neutral-800 gap-3 text-md w-full md:w-auto">
            <SelectValue placeholder="Academic Year" />
          </SelectTrigger>
          <SelectContent>
            {
              uniqueCohorts.map((cohort, index) => (
                <SelectItem key={index} value={cohort}>{cohort}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
        <Select onValueChange={setSelectedClass}>
          <SelectTrigger className="bg-gray-200 dark:bg-neutral-800 gap-3 text-md w-full md:w-auto">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            {
              classes.map((course, index) => (
                <SelectItem key={index} value={course}>{course}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
      <Button variant="secondary" className="bg-gray-200 dark:bg-neutral-800 font-semibold text-md mt-4 md:mt-0 w-full md:w-auto">
        <Plus size={24} />
        <span className="ml-2" onClick={open}>Add New Student</span>
      </Button>
    </div>
  );
}

const StudentRow = ({ student }: { student: Student; }) => {
  const [courses, setCourses] = useState<string[]>([]);

  const fetchStudentCourses = async (studentId: number) => {
    const [courses, studentCourseReports] = await Promise.all([
      fetch('/api/fetchCourses').then((res) => res.json()),
      fetch('/api/fetchStudentCourse').then((res) => res.json())
    ]);
    
    const studentCourses = studentCourseReports.filter((report: StudentCourseReport) => report.student_id === studentId);
    const courseNames = studentCourses.map((report: StudentCourseReport) => {
      const course = courses.find((course: Course) => course.id === report.course_id);
      return course.name;
    });

    setCourses(courseNames);
  }

  useEffect(() => {
    fetchStudentCourses(student.id);
  }, [student.id]);

  return (
    <TableRow>
      <TableCell>{student.name}</TableCell>
      <TableCell>{student.cohort}</TableCell>
      <TableCell className="flex flex-wrap gap-1">
        {
          courses.map((course, index) => (
            <span key={index} className="text-sm p-1 bg-stone-200 rounded-md">{course}</span>
          ))
        }
      </TableCell>
      <TableCell>{new Date(student.date_joined).toDateString()}</TableCell>
      <TableCell>{new Date(student.last_login).toLocaleString()}</TableCell>
      <TableCell><FaCircle size={10} className={student.status === StudentStatus.ACTIVE ? 'text-green-500' : 'text-red-500'} /></TableCell>
    </TableRow>
  );
}

const StudentsTable = ({ cohortFilter, classFilter }: { cohortFilter: string, classFilter: string }) => {
  const students = useStudentStore((state) => state.students);
  const fetchStudents = useStudentStore((state) => state.fetchStudents);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  const fetchStudentCourses = async (studentId: number) => {
    const [courses, studentCourseReports] = await Promise.all([
      fetch('/api/fetchCourses').then((res) => res.json()),
      fetch('/api/fetchStudentCourse').then((res) => res.json())
    ]);
    
    const studentCourses = studentCourseReports.filter((report: StudentCourseReport) => report.student_id === studentId);
    const courseNames = studentCourses.map((report: StudentCourseReport) => {
      const course = courses.find((course: Course) => course.id === report.course_id);
      return course.name;
    });

    return courseNames;
  }

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    const filterStudents = async () => {
      const filtered = await Promise.all(students.map(async (student) => {
        const courses = await fetchStudentCourses(student.id);
        const matchesCohort = cohortFilter ? student.cohort === cohortFilter : true;
        const matchesClass = classFilter ? courses.includes(classFilter) : true;
        return matchesCohort && matchesClass ? student : null;
      }));
      setFilteredStudents(filtered.filter(student => student !== null) as Student[]);
    };

    filterStudents();
  }, [students, cohortFilter, classFilter]);

  return (
    <Table className="text-md w-full overflow-x-auto">
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold text-neutral-900 dark:text-neutral-100">Student Name</TableHead>
          <TableHead className="font-bold text-neutral-900 dark:text-neutral-100">Cohort</TableHead>
          <TableHead className="font-bold text-neutral-900 dark:text-neutral-100">Courses</TableHead>
          <TableHead className="font-bold text-neutral-900 dark:text-neutral-100">Date Joined</TableHead>
          <TableHead className="font-bold text-neutral-900 dark:text-neutral-100">Last Login</TableHead>
          <TableHead className="font-bold text-neutral-900 dark:text-neutral-100">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredStudents.map((student) => (
          <StudentRow key={student.id} student={student} />
        ))}
      </TableBody>
    </Table>
  );
}

const Students = () => {
  const { isOpen } = useModalStore();
  const [cohortFilter, setCohortFilter] = useState<string>('');
  const [classFilter, setClassFilter] = useState<string>('');

  const handleFilterChange = (cohort: string, className: string) => {
    setCohortFilter(cohort);
    setClassFilter(className);
  };

  return (
    <section className="bg-white dark:bg-black rounded-lg w-full h-full p-3 overflow-x-auto">
      <TableControl onFilterChange={handleFilterChange} />
      <StudentsTable cohortFilter={cohortFilter} classFilter={classFilter} />
      {
        isOpen && <StudentModal />
      }
    </section>
  )
}

export default Students;