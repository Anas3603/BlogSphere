import { RegisterForm } from "@/components/auth/RegisterForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
    const session = await getSession();
    if (session) {
        redirect("/");
    }
    return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
            <RegisterForm />
        </div>
    );
}
