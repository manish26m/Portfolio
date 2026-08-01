import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default function NewExperiencePage() {
  return (
    <div className="min-h-screen bg-[#080808]">
      <AdminSidebar />
      <div className="pl-64"><ExperienceForm /></div>
    </div>
  );
}
