"use client";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/Header/dashboardHeader";
import { useEffect } from "react";
import { toast } from "sonner";
import moment from "moment";

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function MainDashboardLayout({ children, title }: Props) {
  return (
    <div className="min-h-screen flex ">
      <div
        className="w-full md:w-[500px] mx-auto  lg:ml-64 overflow-auto"
        style={{
          width: "950px",
        }}
      >
        <DashboardHeader />
        <main className="p-6 lg:py-8 flex lg:justify-center">
          <div className=" w-full mx-auto md:w-[900px] md:ml-[2em]">
            {title && (
              <h3 className={"font-semibold  text-sm mb-4"}>{title}</h3>
            )}
            {children}
          </div>
        </main>
      </div>
      <div className="flex items-center justify-between">
        <Sidebar />
      </div>
    </div>
  );
}
