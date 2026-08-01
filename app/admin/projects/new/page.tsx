import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-[#080808]">
      <AdminSidebar />
      <div className="pl-64">
        <ProjectForm />
      </div>
    </div>
  );
}
