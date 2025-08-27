// app/dashboard/page.tsx
import Dashboard from "@/components/Dashboard/Dashboard";
import DashboardGuard from "@/components/Dashboard/DashboardGuard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // if not logged in → redirect to your login page
  if (!session) {
    redirect("/app/login");
  }

  return (
    <DashboardGuard>
      <Dashboard />
    </DashboardGuard>
  );
}
