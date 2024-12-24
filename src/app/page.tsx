"use client";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Toggle from "@/components/ui/toggle";

const Home = () => {
  const router = useRouter();

  return (
    <div
      className="flex flex-col md:flex-row justify-center items-center h-screen p-5 gap-10 home-background"
    >
      <Toggle size={24} className="absolute top-5 right-5 rounded-full bg-stone-900 text-neutral-100 dark:bg-stone-100 dark:text-neutral-900 p-3" />
      
      <Logo className="w-full md:w-1/4" />

      <div
        className="flex flex-col gap-5 w-full md:w-1/3"
      >
        <p>
          Quyl is a modern web application built to facilitate the classroom management process for teachers and students. With Quyl, teachers can easily manage their students, chapters and reports, while students can keep track of their progress and access help when needed.
        </p>
        <div className="flex justify-center items-center w-full p-5 gap-5">
          <Button onClick={() => router.push("/dashboard")}>
            Proceed to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Home