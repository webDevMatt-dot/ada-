"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, X, Loader2, LogOut } from "lucide-react";

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

export default function AdminPrayerWall() {
    const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const getAuthHeaders = () => {
        const token = localStorage.getItem("authToken");
        return token ? { "Authorization": `Token ${token}` } : null;
    };

    const fetchPrayers = async () => {
        setLoading(true);
        const headers = getAuthHeaders();

        if (!headers) {
            router.push("/prayer-wall/login");
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/api/prayers/?admin=true", { headers });

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("authToken");
                router.push("/prayer-wall/login");
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setPrayers(data);
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
        if (!headers) return; // Should allow redirect in next fetch

        try {
            await fetch(`http://localhost:8000/api/prayers/${id}/approve/`, {
                method: "POST",
                headers
            });
            fetchPrayers(); // Refresh
        } catch (error) {
            console.error("Failed to approve", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        router.push("/prayer-wall/login");
    }

    const pendingPrayers = prayers.filter(p => !p.is_approved);
    const approvedPrayers = prayers.filter(p => p.is_approved);

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container mx-auto p-8 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Prayer Wall Admin</h1>
                <Button variant="outline" onClick={handleLogout} className="text-slate-600 gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                </Button>
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-amber-600">Pending Approval ({pendingPrayers.length})</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {pendingPrayers.length === 0 && <p className="text-slate-400">No pending requests.</p>}
                        {pendingPrayers.map(prayer => (
                            <PrayerCard key={prayer.id} prayer={prayer} onApprove={() => handleApprove(prayer.id)} />
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-green-600">Previously Approved</h2>
                    <div className="grid gap-4 md:grid-cols-2 opacity-75">
                        {approvedPrayers.map(prayer => (
                            <PrayerCard key={prayer.id} prayer={prayer} readonly />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

function PrayerCard({ prayer, onApprove, readonly }: { prayer: PrayerRequest, onApprove?: () => void, readonly?: boolean }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{prayer.author}</CardTitle>
                        <CardDescription>{new Date(prayer.created_at).toLocaleString()}</CardDescription>
                    </div>
                    <Badge>{prayer.category}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-slate-700">{prayer.content}</p>
            </CardContent>
            {!readonly && (
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <X className="w-4 h-4 mr-1" /> Remove
                    </Button>
                    <Button size="sm" onClick={onApprove} className="bg-green-600 hover:bg-green-700">
                        <Check className="w-4 h-4 mr-1" /> Approve
                    </Button>
                </CardFooter>
            )}
            {readonly && (
                <CardFooter className="flex justify-between text-sm text-slate-500">
                    <span>Likes: {prayer.likes}</span>
                    {prayer.is_viral && <Badge variant="secondary" className="bg-purple-100 text-purple-700">Viral</Badge>}
                </CardFooter>
            )}
        </Card>
    )
}
