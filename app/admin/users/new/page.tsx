"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2, ArrowLeft, Building } from "lucide-react";
import Link from "next/link";

export default function NewUserPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        department: "HQ",
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const token = localStorage.getItem("authToken");

        try {
            const res = await fetch("/api/users", {
                method: "POST",
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
                setError(JSON.stringify(data) || "Failed to create user");
            }
        } catch (error) {
            console.error("Error submitting form", error);
            setError("Network error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/users">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Create New Account</h2>
                    <p className="text-slate-500">Add a new administrator or team member.</p>
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
                                    required
                                />
                            </div>

                            {/* Last Name */}
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    required
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
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        {/* Department - Single Select */}
                        <div className="space-y-2">
                            <Label htmlFor="department">Department / Team</Label>
                            <Select
                                value={formData.department}
                                onValueChange={(val) => setFormData({ ...formData, department: val })}
                                required
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
                            <p className="text-xs text-slate-500 mt-1">This user's updates will be automatically tagged with this team.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 border-t bg-slate-50 py-4">
                        <Link href="/admin/users">
                            <Button variant="ghost" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={loading} className="bg-[#8b1d2c] hover:bg-[#6d1722] min-w-[120px]">
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Create User"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
