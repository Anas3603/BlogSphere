import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Home, Users, FileText, Feather } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "admin") {
    // Or a dedicated 'unauthorized' page
    redirect("/");
  }

  return (
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AdminSidebar />
          <SidebarInset className="flex-1">
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
  );
}
