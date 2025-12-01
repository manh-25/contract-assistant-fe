// src/layouts/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar"; 

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-full bg-[#F4F5F7] font-sans text-slate-700">
      
      {/* 1. Sidebar cố định bên trái */}
      <Sidebar />

      {/* 2. Vùng nội dung chính (Thay đổi theo từng trang) */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto w-full h-full">
           {/* Outlet là nơi Dashboard.tsx sẽ được hiển thị */}
           <Outlet /> 
        </div>
      </main>
    </div>
  );
}