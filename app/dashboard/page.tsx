// app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { redirect } from "next/navigation";
import TeacherDashboard from "./TeacherDashboard";
import ParentDashboard from "./ParentDashboard";
import StudentDashboard from "./StudentDashboard";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  switch (session.user.role) {
    case 'teacher':
      return <TeacherDashboard session={session} />;
    case 'parent':
      return <ParentDashboard session={session} />;
    case 'student':
      return <StudentDashboard session={session} />;
    default:
      redirect("/login"); // or to an error page
  }
}