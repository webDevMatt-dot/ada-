"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, MessageSquare, LogOut, Menu, X, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        // Skip check on login page
        if (pathname === "/admin/login") {
            setAuthorized(true);
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        // Validate token and get user info
        fetch("http://localhost:8000/api/me/", {
            headers: { "Authorization": `Token ${token}` }
        })
            .then(res => {
                if (res.ok) return res.json();
                throw new Error("Invalid token");
            })
            .then(user => {
                setCurrentUser(user);
                setAuthorized(true);
            })
            .catch(() => {
                localStorage.removeItem("authToken");
                router.push("/admin/login");
            });

        // Inactivity Timer
        let timeout: NodeJS.Timeout;
        const events = ['mousemove', 'keydown', 'click', 'scroll'];

        const resetTimer = () => {
            clearTimeout(timeout);
            // 3 minutes = 180000 ms
            timeout = setTimeout(() => {
                localStorage.removeItem("authToken");
                router.push("/admin/login?reason=timeout");
            }, 180000);
        };

        // Start timer initially
        resetTimer();

        // Listen for events
        events.forEach(event => window.addEventListener(event, resetTimer));

        // Cleanup
        return () => {
            clearTimeout(timeout);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };

    }, [pathname, router]);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        router.push("/admin/login");
    };

    if (!authorized) {
        return null; // Or a loading spinner
    }

    // Don't show layout on login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Prayer Wall", href: "/admin/prayers", icon: MessageSquare, adminOnly: true },
        { name: "Updates", href: "/admin/updates", icon: Calendar },
        { name: "Users", href: "/admin/users", icon: Users, adminOnly: true },
    ];

    const visibleNavItems = navItems.filter(item =>
        !item.adminOnly || (currentUser?.is_superuser || currentUser?.is_staff)
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-[#1e293b] text-white fixed h-full inset-y-0 z-50">
                <div className="p-6 border-b border-slate-700 flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg">
                        <LayoutDashboard className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <span className="block font-bold text-lg tracking-tight">ADA Admin</span>
                        <span className="text-xs text-slate-400">Management Portal</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {visibleNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                                    isActive
                                        ? "bg-[#8b1d2c] text-white shadow-md"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10 gap-3"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] text-white transform transition-transform duration-200 md:hidden flex flex-col",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                    <span className="font-bold text-lg">ADA Admin</span>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </Button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {visibleNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                                    isActive
                                        ? "bg-[#8b1d2c] text-white shadow-md"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10 gap-3"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </Button>
                </div>
            </aside>


            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen transition-all duration-200">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-slate-500"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </Button>
                        <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">
                            Dashboard
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
                            {currentUser?.username?.substring(0, 2).toUpperCase() || 'AD'}
                        </div>
                    </div>
                </header>
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
