import Link from "next/link";
import { CircleUserRound, Feather } from "lucide-react";

import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignOutButton from "../auth/SignOutButton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center h-16">
        <Link href="/" className="flex items-center gap-2 mr-8">
          <Feather className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg font-headline">BlogSphere</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          {/* Add other nav links here if needed */}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          {session ? (
            <>
               <Button asChild>
                <Link href="/posts/new">
                  <Feather className="mr-2 h-4 w-4" />
                  Write
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.avatar} alt={session.name} />
                      <AvatarFallback>
                        {session.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  {session.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/posts">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <SignOutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
