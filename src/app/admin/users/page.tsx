import { getUsers } from "@/lib/data";
import { UsersDataTable } from "@/components/admin/UsersDataTable";

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Manage Users</h1>
      </div>
      <UsersDataTable data={users} />
    </div>
  );
}
