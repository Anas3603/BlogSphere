"use client";

import { signOut } from "@/lib/actions";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function SignOutButton() {
  return (
    <DropdownMenuItem onClick={() => signOut()}>
      Log out
    </DropdownMenuItem>
  );
}
