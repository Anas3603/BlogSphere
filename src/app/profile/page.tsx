import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { getUserPosts } from "@/lib/data";
import { UserPosts } from "@/components/profile/UserPosts";
import { Separator } from "@/components/ui/separator";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const userPosts = await getUserPosts(session.id);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={session.avatar} alt={session.name} />
                <AvatarFallback className="text-3xl">
                  {session.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{session.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm user={session} />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-6 font-headline tracking-tight">Your Posts</h2>
            <Separator className="mb-6" />
            <UserPosts posts={userPosts} />
        </div>
      </div>
    </div>
  );
}
