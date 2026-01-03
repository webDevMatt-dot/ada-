"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, Calendar, MapPin, ArrowRight, Users, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Update {
    id: number;
    title: string;
    status: string;
    rejection_reason?: string;
    created_by: number;
}

export default function AdminDashboard() {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [deniedUpdates, setDeniedUpdates] = useState<Update[]>([]);
    const [deniedOpen, setDeniedOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // 1. Fetch User
                const userRes = await fetch("http://localhost:8000/api/me/", {
                    headers: { "Authorization": `Token ${token}` }
                });

                let user = null;
                if (userRes.ok) {
                    user = await userRes.json();
                    setCurrentUser(user);
                }

                // 2. Fetch User's Updates
                // Fetch ALL updates and filter client-side to be safe and consistent
                const updatesRes = await fetch("http://localhost:8000/api/updates/", {
                    headers: { "Authorization": `Token ${token}` }
                });

                if (updatesRes.ok && user) {
                    const updates: Update[] = await updatesRes.json();
                    // Filter for: Status is 'review' AND Created by Me
                    const myDenied = updates.filter(u => u.status === 'review' && u.created_by === user.id);

                    // Check session storage to see if we already ignored this session globally
                    const globalIgnored = sessionStorage.getItem("ignoredDeniedPopup");

                    // Also check for specific IDs ignored (e.g. just returned by me)
                    const ignoredIds: number[] = JSON.parse(sessionStorage.getItem("ignoredDeniedIds") || "[]");

                    const actionableDenied = myDenied.filter(u => !ignoredIds.includes(u.id));

                    if (actionableDenied.length > 0 && !globalIgnored) {
                        setDeniedUpdates(actionableDenied);
                        setDeniedOpen(true);
                    }
                }

            } catch (e) {
                console.error("Failed to fetch dashboard data", e);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    const handleIgnore = () => {
        setDeniedOpen(false);
        sessionStorage.setItem("ignoredDeniedPopup", "true");
    };

    const modules = [
        {
            title: "Prayer Wall",
            description: "Manage prayer requests, approve pending items, and monitor activity.",
            icon: MessageSquare,
            href: "/admin/prayers",
            color: "text-blue-500",
            bg: "bg-blue-50",
            adminOnly: true
        },
        {
            title: "Users",
            description: "Create accounts and assign team departments.",
            icon: Users,
            href: "/admin/users",
            color: "text-pink-500",
            bg: "bg-pink-50",
            adminOnly: true
        },
        {
            title: "Updates",
            description: "Post news, announcements, and upload flyers.",
            icon: Calendar,
            href: "/admin/updates",
            color: "text-amber-500",
            bg: "bg-amber-50"
        },
        // Placeholder modules for future
        {
            title: "Events",
            description: "View and manage upcoming church events and calendars.",
            icon: Calendar,
            href: "/events", // Link to public for now
            color: "text-purple-500",
            bg: "bg-purple-50",
            external: true,
            adminOnly: true
        },
        {
            title: "Locations",
            description: "Update church locations, service times, and contact info.",
            icon: MapPin,
            href: "/locations", // Link to public for now
            color: "text-green-500",
            bg: "bg-green-50",
            external: true,
            adminOnly: true
        }
    ];

    const visibleModules = modules.filter(m => !m.adminOnly || (currentUser?.is_superuser || currentUser?.is_staff));

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome back!</h2>
                <p className="text-slate-500 mt-2">Here's what's happening across the ADA Church platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleModules.map((module) => (
                    <Card key={module.title} className="hover:shadow-md transition-shadow cursor-pointer border-slate-200">
                        <Link href={module.href} target={module.external ? "_blank" : undefined}>
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className={`p-3 rounded-lg ${module.bg}`}>
                                    <module.icon className={`h-6 w-6 ${module.color}`} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold">{module.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm text-slate-500 mb-4 h-10">
                                    {module.description}
                                </CardDescription>
                                <div className="flex items-center text-sm font-medium text-slate-900 group">
                                    {module.external ? "View Page" : "Manage Now"}
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>

            {/* Notification Dialog */}
            <Dialog open={deniedOpen} onOpenChange={setDeniedOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-amber-600 flex items-center gap-2">
                            <RotateCcw className="w-5 h-5" /> Action Required
                        </DialogTitle>
                        <DialogDescription>
                            Some of your updates have been returned for review.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[300px] overflow-y-auto space-y-3">
                        {deniedUpdates.map(u => (
                            <div key={u.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <h4 className="font-medium text-slate-800 text-sm">{u.title}</h4>
                                <p className="text-xs text-red-600 mt-1 font-semibold">{u.rejection_reason}</p>
                            </div>
                        ))}
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={handleIgnore}>Ignore for now</Button>
                        <Button
                            className="bg-[#8b1d2c] hover:bg-[#6d1722]"
                            onClick={() => {
                                setDeniedOpen(false);
                                // Navigate to updates page with tab pre-selected
                                router.push(`/admin/updates?tab=review`);
                            }}
                        >
                            Fix Updates
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
