"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Plus, Loader2, User as UserIcon, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
    department: string;
}

interface User {
    id: number;
    username: string;
    email: string;
    profile: UserProfile;
}

export default function UsersAdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUsers = async () => {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
            router.push("/admin/login");
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/api/users/", {
                headers: { "Authorization": `Token ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else if (res.status === 403) {
                router.push("/admin"); // Redirect unauthorized users
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                    <p className="text-slate-500">Create new accounts and assign department teams.</p>
                </div>
                <Link href="/admin/users/new">
                    <Button className="bg-[#8b1d2c] hover:bg-[#6d1722] gap-2">
                        <Plus className="w-4 h-4" /> New User
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="animate-spin text-slate-400 w-8 h-8" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => (
                        <Card key={user.id} className="flex flex-col border-slate-200">
                            <CardHeader className="flex flex-row items-center gap-4 pb-4">
                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    <UserIcon className="w-6 h-6" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <CardTitle className="text-lg truncate">{user.username}</CardTitle>
                                    <CardDescription className="truncate">{user.email}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 flex-grow">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-600">Department:</span>
                                </div>
                                <Badge variant="secondary" className="text-sm py-1 px-3 bg-slate-100 text-slate-800 border-slate-200 font-medium">
                                    {user.profile?.department || "Unassigned"}
                                </Badge>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2 border-t bg-slate-50 py-3 mt-auto">
                                <Link href={`/admin/users/${user.id}`}>
                                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">
                                        Edit
                                    </Button>
                                </Link>
                                <DeleteUserButton userId={user.id} onDeleted={fetchUsers} />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

function DeleteUserButton({ userId, onDeleted }: { userId: number, onDeleted: () => void }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        setLoading(true);
        const token = localStorage.getItem("authToken");

        try {
            const res = await fetch(`http://localhost:8000/api/users/${userId}/`, {
                method: "DELETE",
                headers: { "Authorization": `Token ${token}` }
            });

            if (res.ok) {
                onDeleted();
            } else {
                alert("Failed to delete user");
            }
        } catch (error) {
            console.error("Delete failed", error);
            alert("Delete failed due to network error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Delete"}
        </Button>
    );
}
