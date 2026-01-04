"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { use } from "react";

export default function EditHistoryEventPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        date: "",
        title: "",
        description: ""
    });

    useEffect(() => {
        const fetchEvent = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                router.push("/admin/login");
                return;
            }

            try {
                const res = await fetch(`/api/history/${resolvedParams.id}/`, {
                    headers: { "Authorization": `Token ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        date: data.date,
                        title: data.title,
                        description: data.description
                    });
                } else {
                    alert("Failed to load event");
                    router.push("/admin/history");
                }
            } catch (error) {
                console.error("Failed to fetch event", error);
            } finally {
                setFetching(false);
            }
        };

        fetchEvent();
    }, [resolvedParams.id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("authToken");
        try {
            const res = await fetch(`/api/history/${resolvedParams.id}/`, {
                method: "PUT",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push("/admin/history");
            } else {
                alert("Failed to update event");
            }
        } catch (error) {
            console.error("Failed to update event", error);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="animate-spin text-slate-400 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/history">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold text-slate-800">Edit History Event</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Event</CardTitle>
                    <CardDescription>Update the details of this timeline event.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                            <p className="text-xs text-slate-500">The year will be automatically updated.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                required
                                placeholder="e.g. First Service"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                required
                                placeholder="Describe slightly what happened..."
                                className="min-h-[100px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 flex justify-end gap-2">
                            <Link href="/admin/history">
                                <Button type="button" variant="ghost">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={loading} className="bg-[#8b1d2c] hover:bg-[#6d1722]">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
