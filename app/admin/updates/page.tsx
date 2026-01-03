"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Plus, Loader2, Calendar as CalendarIcon, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface Update {
    id: number;
    title: string;
    description: string;
    category: string;
    image: string | null;
    created_at: string;
    team: string;
    is_approved: boolean;
}

function ApproveButton({ id, onApproved }: { id: number, onApproved: () => void }) {
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        try {
            const res = await fetch(`http://localhost:8000/api/updates/${id}/approve/`, {
                method: "POST",
                headers: { "Authorization": `Token ${token}` }
            });
            if (res.ok) {
                onApproved();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            size="sm"
            onClick={handleApprove}
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white mt-2"
        >
            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Approve Pending"}
        </Button>
    )
}

export default function UpdatesAdminPage() {
    const [updates, setUpdates] = useState<Update[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUpdates = async () => {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
            router.push("/admin/login");
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/api/updates/", {
                headers: { "Authorization": `Token ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setUpdates(data);
            }
        } catch (error) {
            console.error("Failed to fetch updates", error);
        } finally {
            setLoading(false);
        }
    };

    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("authToken");
            if (token) {
                try {
                    const res = await fetch("http://localhost:8000/api/me/", {
                        headers: { "Authorization": `Token ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setCurrentUser(data);
                    }
                } catch (e) {
                    console.error("Failed to fetch user", e);
                }
            }
        }
        fetchUser();
        fetchUpdates();
    }, []);

    const canApprove = currentUser?.is_superuser || currentUser?.is_staff || currentUser?.department === 'HQ'; // Or just strict admin check

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Updates & Announcements</h2>
                    <p className="text-slate-500">Manage news, volunteer schedules, and gallery uploads.</p>
                </div>
                <Link href="/admin/updates/new">
                    <Button className="bg-[#8b1d2c] hover:bg-[#6d1722] gap-2">
                        <Plus className="w-4 h-4" /> New Update
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="animate-spin text-slate-400 w-8 h-8" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {updates.length === 0 && (
                        <div className="col-span-full text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                            <p className="text-slate-500 mb-4">No updates found.</p>
                            <Link href="/admin/updates/new">
                                <Button variant="outline">Create your first update</Button>
                            </Link>
                        </div>
                    )}
                    {updates.map((update) => (
                        <Card key={update.id} className="overflow-hidden flex flex-col group hover:shadow-md transition-all">
                            <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
                                {update.image ? (
                                    <img
                                        src={update.image}
                                        alt={update.title}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <CalendarIcon className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    <Badge className="bg-white/90 text-slate-900 hover:bg-white">{update.category}</Badge>
                                </div>
                                {!update.is_approved && (
                                    <div className="absolute top-3 left-3">
                                        <Badge variant="destructive" className="bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm">
                                            Pending Approval
                                        </Badge>
                                    </div>
                                )}
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <Users className="w-3 h-3" />
                                        {update.team}
                                    </div>
                                    <span className="text-xs text-slate-400">{new Date(update.created_at).toLocaleDateString()}</span>
                                </div>
                                <CardTitle className="text-lg leading-tight line-clamp-2">{update.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-4 flex-grow">
                                <p className="text-sm text-slate-600 line-clamp-3">{update.description}</p>
                            </CardContent>
                            <CardFooter className="pt-0 border-t border-slate-50 mt-auto p-4 bg-slate-50/50">
                                <Button variant="ghost" size="sm" className="w-full text-slate-500 hover:text-[#8b1d2c]">
                                    Edit Update
                                </Button>
                                {!update.is_approved && canApprove && (
                                    <ApproveButton id={update.id} onApproved={fetchUpdates} />
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
