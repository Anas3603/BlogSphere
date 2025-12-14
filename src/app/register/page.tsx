import { RegisterForm } from "@/components/auth/RegisterForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ClientOnly } from "@/components/shared/ClientOnly";

export default async function RegisterPage() {
    const session = await getSession();
    if (session) {
        redirect("/");
    }
    return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
            <ClientOnly>
                <RegisterForm />
            </ClientOnly>
        </div>
    );
}
