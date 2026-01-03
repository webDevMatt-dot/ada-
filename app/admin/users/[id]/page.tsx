"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2, ArrowLeft, Building, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "", // Keep empty if not changing
        department: "HQ",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            try {
                const res = await fetch(`http://localhost:8000/api/users/${id}/`, {
                    headers: { "Authorization": `Token ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        username: data.username,
                        first_name: data.first_name || "",
                        last_name: data.last_name || "",
                        email: data.email,
                        password: "",
                        department: data.profile?.department || "HQ"
                    });
                } else {
                    setError("Failed to load user");
                }
            } catch (err) {
                console.error(err);
                setError("Network error");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        const token = localStorage.getItem("authToken");

        try {
            const res = await fetch(`http://localhost:8000/api/users/${id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admin/users");
                router.refresh();
            } else {
                const data = await res.json();
                setError(JSON.stringify(data) || "Failed to update user");
            }
        } catch (error) {
            console.error("Error submitting form", error);
            setError("Network error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-slate-400 w-8 h-8" /></div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/users">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Edit User</h2>
                    <p className="text-slate-500">Update account details and team assignment.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* First Name */}
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                />
                            </div>

                            {/* Last Name */}
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Username */}
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Change Password (Optional)</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Leave blank to keep current password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {/* Department - Single Select */}
                        <div className="space-y-2">
                            <Label htmlFor="department">Department / Team</Label>
                            <Select
                                value={formData.department}
                                onValueChange={(val) => setFormData({ ...formData, department: val })}
                            >
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
                                    <div className="flex items-center gap-2">
                                        <Building className="w-4 h-4 text-slate-400" />
                                        <SelectValue placeholder="Select Department" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="HQ">HQ</SelectItem>
                                    <SelectItem value="Youth Ministry">Youth Ministry</SelectItem>
                                    <SelectItem value="BOT">BOT (Youth)</SelectItem>
                                    <SelectItem value="GOQ">GOQ (Youth)</SelectItem>
                                    <SelectItem value="Men of Integrity">Men of Integrity</SelectItem>
                                    <SelectItem value="Go-Quickly">Go-Quickly</SelectItem>
                                    <SelectItem value="Child Evangelism">Child Evangelism</SelectItem>
                                    <SelectItem value="Apostle's Update Team">Apostle's Update Team</SelectItem>
                                    <SelectItem value="FABM Team">FABM Team</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 border-t bg-slate-50 py-4">
                        <Link href="/admin/users">
                            <Button variant="ghost" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={saving} className="bg-[#8b1d2c] hover:bg-[#6d1722] min-w-[120px]">
                            {saving ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Changes"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
