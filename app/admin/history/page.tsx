"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2, Trash2, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HistoryEvent {
    id: number;
    year: number;
    date: string;
    title: string;
    description: string;
}

export default function HistoryAdminPage() {
    const [events, setEvents] = useState<HistoryEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchHistory = async () => {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        try {
            const res = await fetch("/api/history/", {
                headers: { "Authorization": `Token ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        const token = localStorage.getItem("authToken");
        try {
            const res = await fetch(`/api/history/${id}/`, {
                method: "DELETE",
                headers: { "Authorization": `Token ${token}` }
            });

            if (res.ok) {
                fetchHistory(); // Refresh list
            } else {
                alert("Failed to delete event");
            }
        } catch (error) {
            console.error("Failed to delete event", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">History Timeline</h2>
                    <p className="text-slate-500">Manage church history events and milestones.</p>
                </div>
                <Link href="/admin/history/new">
                    <Button className="bg-[#8b1d2c] hover:bg-[#6d1722] gap-2">
                        <Plus className="w-4 h-4" /> Add Event
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="animate-spin text-slate-400 w-8 h-8" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <Card key={event.id} className="hover:shadow-md transition-shadow group relative">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">
                                        {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/admin/history/${event.id}`}>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-red-50"
                                            onClick={() => handleDelete(event.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </div>
                                </div>
                                <CardTitle className="text-lg mt-2">{event.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 line-clamp-3">
                                    {event.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                    {events.length === 0 && (
                        <div className="col-span-full text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                            <p className="text-slate-500 mb-4">No history events found.</p>
                            <Link href="/admin/history/new">
                                <Button variant="outline">Add your first event</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
