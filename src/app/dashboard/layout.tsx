"use client";
import { Sidebar } from "../../components/ui/sidebar"
import Dashheader from "@/components/ui/dashheader"

export default function Dashlayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex w-full h-full">
            <Sidebar />
            <div className="flex flex-col w-full h-full m-0 p-3 gap-4">
                <Dashheader />
                {children}
            </div>
        </div>
    )
}
