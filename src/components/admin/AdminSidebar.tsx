'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Users, FileText, Feather } from "lucide-react";

export default function AdminSidebar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname.startsWith(path);

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 p-2">
                    <Feather className="w-6 h-6 text-primary" />
                    <span className="font-bold text-lg font-headline">BlogSphere</span>
                    <div className="ml-auto">
                        <SidebarTrigger />
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/admin/posts" className='w-full'>
                        <SidebarMenuButton isActive={isActive('/admin/posts')}>
                            <FileText />
                            <span>Posts</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <Link href="/admin/users" className='w-full'>
                        <SidebarMenuButton isActive={isActive('/admin/users')}>
                            <Users />
                            <span>Users</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    )
}
