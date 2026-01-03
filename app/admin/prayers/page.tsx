"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, X, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";

interface PrayerRequest {
    id: number;
    author: string;
    category: string;
    content: string;
    created_at: string;
    is_approved: boolean;
    likes: number;
    is_viral: boolean;
}

export default function PrayersAdminPage() {
    const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const router = useRouter();

    const getAuthHeaders = () => {
        const token = localStorage.getItem("authToken");
        return token ? { "Authorization": `Token ${token}` } : null;
    };

    const fetchPrayers = async () => {
        setLoading(true);
        const headers = getAuthHeaders();

        if (!headers) {
            router.push("/admin/login");
            return;
        }

        try {
            // Use local API for now, plan to configure environment variable
            const res = await fetch("/api/prayers?admin=true", { headers });

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("authToken");
                router.push("/admin/login");
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setPrayers(data);
            } else if (res.status === 403 || res.status === 401) {
                router.push("/admin"); // Kick them out
            }
        } catch (error) {
            console.error("Failed to fetch prayers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrayers();
    }, []);

    const handleApprove = async (id: number) => {
        const headers = getAuthHeaders();
        if (!headers) return;

        try {
            await fetch(`/api/prayers/${id}/approve`, {
                method: "POST",
                headers
            });
            fetchPrayers();
        } catch (error) {
            console.error("Failed to approve", error);
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        const headers = getAuthHeaders();
        if (!headers) return;

        try {
            const res = await fetch(`/api/prayers/${deleteId}`, {
                method: "DELETE",
                headers
            });
            if (res.ok) {
                fetchPrayers();
                setIsDeleteDialogOpen(false);
                setDeleteId(null);
            }
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };


    const pendingPrayers = prayers.filter(p => !p.is_approved);
    const approvedPrayers = prayers.filter(p => p.is_approved);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Prayer Management</h2>
                    <p className="text-slate-500">Review and approve community prayer requests.</p>
                </div>
                <Button onClick={fetchPrayers} variant="outline" size="sm" className="gap-2">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </div>

            {loading && prayers.length === 0 ? (
                <div className="flex justify-center p-12 bg-white rounded-xl border border-slate-200">
                    <Loader2 className="animate-spin text-slate-400 w-8 h-8" />
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Pending Section */}
                    <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                            <h3 className="text-lg font-bold text-amber-900">Pending Approval <span className="ml-2 bg-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded-full">{pendingPrayers.length}</span></h3>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                            {pendingPrayers.length === 0 && <p className="text-slate-400 italic text-sm">No pending requests to review.</p>}
                            {pendingPrayers.map(prayer => (
                                <PrayerCard
                                    key={prayer.id}
                                    prayer={prayer}
                                    onApprove={() => handleApprove(prayer.id)}
                                    onDelete={() => handleDeleteClick(prayer.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Approved Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <h3 className="text-lg font-bold text-slate-800">History <span className="ml-2 bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{approvedPrayers.length}</span></h3>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 opacity-90">
                            {approvedPrayers.map(prayer => (
                                <PrayerCard
                                    key={prayer.id}
                                    prayer={prayer}
                                    readonly
                                    onDelete={() => handleDeleteClick(prayer.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center text-xl">Delete Prayer Request?</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            This action cannot be undone. This will permanently remove the prayer request from the database.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} className="w-full sm:w-auto gap-2 bg-red-600 hover:bg-red-700">
                            <Trash2 className="w-4 h-4" /> Delete Prayer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function PrayerCard({ prayer, onApprove, onDelete, readonly }: { prayer: PrayerRequest, onApprove?: () => void, onDelete?: () => void, readonly?: boolean }) {
    return (
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-900">{prayer.author}</CardTitle>
                        <CardDescription className="text-xs">{new Date(prayer.created_at).toLocaleDateString()}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-slate-50">{prayer.category}</Badge>
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <p className="text-slate-600 text-sm leading-relaxed">{prayer.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-3 border-t border-slate-50 bg-slate-50/50">
                {readonly ? (
                    <div className="flex gap-2 text-xs text-slate-400 items-center">
                        <span>❤️ {prayer.likes}</span>
                        {prayer.is_viral && <span className="text-purple-600 font-bold ml-2">Viral</span>}
                    </div>
                ) : (
                    <div />
                )}

                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 px-2"
                    >
                        <X className="w-4 h-4" />
                        <span className="sr-only">Delete</span>
                    </Button>

                    {!readonly && (
                        <Button
                            size="sm"
                            onClick={onApprove}
                            className="bg-green-600 hover:bg-green-700 h-8 text-xs"
                        >
                            <Check className="w-3 h-3 mr-1" /> Approve
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}
