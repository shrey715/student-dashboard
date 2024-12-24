import { X } from "lucide-react";
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
import { Course, StudentStatus } from "@prisma/client";
import { useModalStore, useStudentStore } from "@/lib/zustand-store";
import { useEffect, useState, useRef } from "react";

const StudentModal = () => {
  const { close } = useModalStore();
  const { fetchStudents } = useStudentStore();

  const getCourses = async () => {
    const response = await fetch("/api/fetchCourses");
    const data = await response.json();
    return data;
  };

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const cohortRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getCourses();
      setCourses(data);
    };

    fetchCourses();
  }, []);

  const onCourseToggle = (courseId: number) => {
    setSelectedCourses((prevSelected) =>
      prevSelected.includes(courseId)
        ? prevSelected.filter((id) => id !== courseId)
        : [...prevSelected, courseId]
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const student = {
      name: nameRef.current?.value || "",
      cohort: cohortRef.current?.value || "",
      status: statusRef.current?.value || StudentStatus.ACTIVE,
      courses: selectedCourses,
    };

    console.log(student);
    const response = await fetch("/api/addStudents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    if (response.ok) {
      fetchStudents();
      close();
    }
  };

  return (
    <div className="p-4 absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 min-h-screen min-w-screen">
      <div className="bg-stone-900 text-neutral-200 dark:bg-stone-200 dark:text-neutral-900 p-8 rounded-lg lg:w-1/3 md:w-1/2 sm:w-2/3 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add New Student</h2>
          <X size={24} onClick={close} className="cursor-pointer" />
        </div>

        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <Label htmlFor="name">Name</Label>
          <Input
            ref={nameRef}
            type="text"
            id="name"
            placeholder="Enter student name"
            className="bg-stone-800 dark:bg-stone-200 text-neutral-200 dark:text-neutral-800"
          />

          <Label htmlFor="cohort">Cohort</Label>
          <Input
            ref={cohortRef}
            type="text"
            id="cohort"
            placeholder="Enter student cohort"
            className="bg-stone-800 dark:bg-stone-200 text-neutral-200 dark:text-neutral-800"
          />

          <Label htmlFor="status">Status</Label>
          <select
            ref={statusRef}
            className="bg-stone-800 dark:bg-stone-200 text-neutral-200 dark:text-neutral-800 rounded-md p-2"
          >
            <option value={StudentStatus.ACTIVE}>Active</option>
            <option value={StudentStatus.INACTIVE}>Inactive</option>
          </select>

          <Label htmlFor="courses">Courses</Label>
          <div className="bg-stone-800 dark:bg-stone-200 text-neutral-200 dark:text-neutral-800 rounded-md p-2 max-h-40 overflow-y-auto">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id={`course-${course.id}`}
                  value={course.id}
                  checked={selectedCourses.includes(course.id)}
                  onChange={() => onCourseToggle(course.id)}
                  className="accent-blue-500"
                />
                <label htmlFor={`course-${course.id}`} className="cursor-pointer">
                  {course.name}
                </label>
              </div>
            ))}
          </div>

          <Button variant="secondary" className="font-semibold" type="submit">
            Add Student
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;