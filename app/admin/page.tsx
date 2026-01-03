"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, Calendar, MapPin, ArrowRight, Users } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
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
    }, []);

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
        </div>
    );
}
