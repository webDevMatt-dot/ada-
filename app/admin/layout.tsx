"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, MessageSquare, LogOut, Menu, X, Calendar, Users, ChevronLeft, ChevronRight, CalendarDays, MapPin, History } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile
    const [collapsed, setCollapsed] = useState(false); // Desktop
    const [authorized, setAuthorized] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const [counts, setCounts] = useState({ pending: 0, live: 0, review: 0 });
    const [prayerCounts, setPrayerCounts] = useState({ pending: 0 });

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
        fetch("/api/me", {
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

        // Fetch updates for counts
        fetch("/api/updates", {
            headers: { "Authorization": `Token ${token}` }
        })
            .then(res => res.ok ? res.json() : [])
            .then(updates => {
                const newCounts = { pending: 0, live: 0, review: 0 };
                if (Array.isArray(updates)) {
                    updates.forEach((u: any) => {
                        if (u.status === 'pending') newCounts.pending++;
                        if (u.status === 'live') newCounts.live++;
                        if (u.status === 'review') newCounts.review++;
                    });
                }
                setCounts(newCounts);
            })
            .catch(err => console.error("Failed to fetch counts", err));

        // Fetch prayers for counts
        fetch("/api/prayers?admin=true", {
            headers: { "Authorization": `Token ${token}` }
        })
            .then(res => res.ok ? res.json() : [])
            .then(prayers => {
                const newCounts = { pending: 0 };
                if (Array.isArray(prayers)) {
                    prayers.forEach((p: any) => {
                        if (!p.is_approved) newCounts.pending++;
                    });
                }
                setPrayerCounts(newCounts);
            })
            .catch(err => console.error("Failed to fetch prayer counts", err));

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

    const toggleMenu = (name: string) => {
        setExpandedMenus(prev =>
            prev.includes(name)
                ? prev.filter(n => n !== name)
                : [...prev, name]
        );
    };

    if (!authorized) {
        return null; // Or a loading spinner
    }

    // Don't show layout on login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // Dynamic Navigation Configuration
    interface NavItem {
        name: string;
        href: string;
        icon: any;
        adminOnly?: boolean;
        external?: boolean;
        subItems?: { name: string; href: string; count?: number; color?: string; }[];
    }

    const prayerWallItem: NavItem = prayerCounts.pending > 0 ? {
        name: "Prayer Wall",
        href: "/admin/prayers",
        icon: MessageSquare,
        adminOnly: true,
        subItems: [
            { name: "Pending", href: "/admin/prayers", count: prayerCounts.pending, color: "bg-amber-100 text-amber-700 font-bold" },
            { name: "All Prayers", href: "/admin/prayers" },
        ]
    } : {
        name: "Prayer Wall",
        href: "/admin/prayers",
        icon: MessageSquare,
        adminOnly: true
    };

    const navGroups: { title: string; items: NavItem[] }[] = [
        {
            title: "",
            items: [
                { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
                { name: "Users", href: "/admin/users", icon: Users, adminOnly: true },
            ]
        },
        {
            title: "CMS",
            items: [
                prayerWallItem,
                {
                    name: "Updates",
                    href: "/admin/updates", // Changed to path to allow nav when collapsed
                    icon: Calendar,
                    subItems: [
                        { name: "Pending", href: "/admin/updates?tab=pending", count: counts.pending, color: "bg-amber-100 text-amber-700" },
                        { name: "Live", href: "/admin/updates?tab=live", count: counts.live, color: "bg-green-100 text-green-700" },
                        { name: "Review", href: "/admin/updates?tab=review", count: counts.review, color: "bg-red-100 text-red-700" },
                    ]
                },
                { name: "History", href: "/admin/history", icon: History },
                { name: "FAQ", href: "/admin/faq", icon: MessageSquare },
            ]
        },
        {
            title: "CMS API",
            items: [
                { name: "Events", href: "/events", icon: CalendarDays, external: true },
                { name: "Locations", href: "/locations", icon: MapPin, external: true },
            ]
        }
    ];

    const visibleNavItems = navGroups.flatMap(group => group.items)
        .filter(item => !item.adminOnly || (currentUser?.is_superuser || currentUser?.is_staff));

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar Desktop */}
            <aside className={cn(
                "hidden md:flex flex-col bg-[#1e293b] text-white fixed h-full inset-y-0 z-50 transition-all duration-300",
                collapsed ? "w-20" : "w-64"
            )}>
                <div className={cn("p-6 border-b border-slate-700 flex items-center gap-3", collapsed && "justify-center p-4")}>
                    <div className="bg-white/10 p-2 rounded-lg flex-shrink-0">
                        <LayoutDashboard className="w-6 h-6 text-amber-500" />
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden whitespace-nowrap">
                            <span className="block font-bold text-lg tracking-tight">ADA Admin</span>
                            <span className="text-xs text-slate-400">Management Portal</span>
                        </div>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
                    {navGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-1">
                            {group.title && !collapsed && (
                                <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    {group.title}
                                </h3>
                            )}
                            {group.title && collapsed && (
                                <div className="h-px bg-slate-700 mx-2 my-2" />
                            )}

                            {group.items.filter(item => !item.adminOnly || (currentUser?.is_superuser || currentUser?.is_staff)).map((item) => {
                                const Icon = item.icon;
                                const hasSubItems = !!item.subItems;
                                const isExpanded = expandedMenus.includes(item.name);
                                const isActive = pathname === item.href || (item.subItems && item.subItems.some(sub => pathname + window.location.search === sub.href));

                                // If it has subitems, the parent is a toggle, unless invalid href OR collapsed
                                const isLink = !hasSubItems || collapsed;

                                const ItemContent = (
                                    <div className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm cursor-pointer",
                                        isActive && !hasSubItems
                                            ? "bg-[#8b1d2c] text-white shadow-md"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white",
                                        collapsed && "justify-center px-2"
                                    )}>
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        {!collapsed && (
                                            <>
                                                <span className="whitespace-nowrap overflow-hidden flex-1">{item.name}</span>
                                                {hasSubItems && (
                                                    <ChevronRight className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-90")} />
                                                )}
                                                {/* @ts-ignore */}
                                                {item.external && <ChevronRight className="w-3 h-3 opacity-50" />}
                                            </>
                                        )}
                                    </div>
                                );

                                return (
                                    <div key={item.name} className="space-y-1">
                                        {isLink ? (
                                            <Link href={item.href} title={collapsed ? item.name : undefined} target={
                                                // @ts-ignore
                                                item.external ? "_blank" : undefined}>
                                                {ItemContent}
                                            </Link>
                                        ) : (
                                            <div onClick={() => !collapsed && toggleMenu(item.name)} title={collapsed ? item.name : undefined}>
                                                {ItemContent}
                                            </div>
                                        )}

                                        {/* Subitems */}
                                        {!collapsed && hasSubItems && isExpanded && item.subItems && (
                                            <div className="pl-12 space-y-1 pb-2 animate-in slide-in-from-top-2 duration-200">
                                                {item.subItems.map(sub => (
                                                    <Link
                                                        key={sub.name}
                                                        href={sub.href}
                                                        className="flex items-center justify-between py-1.5 pr-4 text-xs text-slate-500 hover:text-white transition-colors"
                                                    >
                                                        <span>{sub.name}</span>
                                                        {sub.count !== undefined && sub.count > 0 && (
                                                            <span className={cn("px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[1.5rem] text-center", sub.color)}>
                                                                {sub.count}
                                                            </span>
                                                        )}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-700 space-y-2">
                    <Button
                        variant="ghost"
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full justify-center text-slate-400 hover:text-white hover:bg-white/5"
                    >
                        {collapsed ? <ChevronRight className="w-5 h-5" /> : <div className="flex items-center gap-2 w-full"><ChevronLeft className="w-5 h-5" /> <span>Collapse</span></div>}
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className={cn(
                            "w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10 gap-3",
                            collapsed && "justify-center px-0"
                        )}
                        title={collapsed ? "Sign Out" : undefined}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span className="whitespace-nowrap overflow-hidden">Sign Out</span>}
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

            {/* Mobile Sidebar (Unchanged) */}
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
            <main className={cn(
                "flex-1 min-h-screen transition-all duration-300",
                collapsed ? "md:ml-20" : "md:ml-64"
            )}>
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
