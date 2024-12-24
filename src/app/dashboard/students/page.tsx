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
import { Plus } from "lucide-react";
import { FaCircle } from 'react-icons/fa';
import { Student, StudentStatus } from '@prisma/client';
import { useStudentStore } from "@/lib/zustand-store";
import { useEffect } from "react";

const TableControl = () => {
  return (
    <div
      className="flex items-center justify-between w-full mb-4"
    >
      <div className="flex flex-row justify-start items-center gap-3 font-semibold">
        <Select>
          <SelectTrigger className="bg-gray-200 dark:bg-neutral-800 gap-3 text-md">
            <SelectValue placeholder="Academic Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AY 2021-2022">AY 2021-2022</SelectItem>
            <SelectItem value="AY 2020-2021">AY 2020-2021</SelectItem>
            <SelectItem value="AY 2019-2020">AY 2019-2020</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="bg-gray-200 dark:bg-neutral-800 gap-3 text-md">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Grade 1">Grade 1</SelectItem>
            <SelectItem value="Grade 2">Grade 2</SelectItem>
            <SelectItem value="Grade 3">Grade 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="secondary" className="bg-gray-200 dark:bg-neutral-800 font-semibold text-md">
        <Plus size={24} />
        <span className="ml-2">Add New Student</span>
      </Button>
    </div>
  );
}

const StudentRow = ({ student }: { student: Student; }) => {
  return (
    <TableRow>
      <TableCell>{student.name}</TableCell>
      <TableCell>{student.cohort}</TableCell>
      <TableCell>Empty</TableCell>
      <TableCell>{new Date(student.date_joined).toDateString()}</TableCell>
      <TableCell>{new Date(student.last_login).toLocaleString()}</TableCell>
      <TableCell><FaCircle size={10} className={student.status === StudentStatus.ACTIVE ? 'text-green-500' : 'text-red-500'} /></TableCell>
    </TableRow>
  );
}

const StudentsTable = () => {
  const students = useStudentStore((state) => state.students);
  const fetchStudents = useStudentStore((state) => state.fetchStudents);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <Table className="text-md">
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
        {students.map((student) => (
          <StudentRow key={student.id} student={student} />
        ))}
      </TableBody>
    </Table>
  );
}

const Students = () => {
  return (
    <section
      className="bg-white dark:bg-black rounded-lg w-full h-full p-3"
    >
      <TableControl />
      <StudentsTable />
    </section>
  )
}

export default Students