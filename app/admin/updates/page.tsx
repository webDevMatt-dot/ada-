"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Plus, Loader2, Calendar as CalendarIcon, Users, Check, X, RotateCcw, Power, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Update {
    id: number;
    title: string;
    description: string;
    category: string;
    image: string | null;
    created_at: string;
    team: string;
    status: 'pending' | 'live' | 'review' | 'inactive' | 'deleted';
    rejection_reason?: string;
    created_by: number;
}

export default function UpdatesAdminPage() {
    const [updates, setUpdates] = useState<Update[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Deny/Return Modal State
    const [returnDialogOpen, setReturnDialogOpen] = useState(false);
    const [selectedUpdateId, setSelectedUpdateId] = useState<number | null>(null);
    const [returnReason, setReturnReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    // Denied Notification State
    const [deniedUpdateOpen, setDeniedUpdateOpen] = useState(false);
    const [myDeniedUpdates, setMyDeniedUpdates] = useState<Update[]>([]);
    // State for Tabs
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "pending");

    // Refs to control popup spam
    const seenDeniedIds = useRef<Set<number>>(new Set());
    const ignoreNextPopup = useRef(false);

    const fetchUpdates = async () => {
        // Don't set global loading on background refresh
        // ... (existing code omitted for brevity if unchanged, but I need to include context or just replace the whole block if easier. I'll replace the block to be safe with context)
        const token = localStorage.getItem("authToken");

        if (!token) {
            router.push("/admin/login");
            return []; // Return empty array if no token
        }

        try {
            const res = await fetch("http://localhost:8000/api/updates/", {
                headers: { "Authorization": `Token ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setUpdates(data);
                return data;
            } else if (res.status === 401) {
                router.push("/admin/login");
            }
        } catch (error) {
            console.error("Failed to fetch updates", error);
        }
        return [];
    };

    // Initial Load & Auth
    useEffect(() => {
        const init = async () => {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            if (token) {
                try {
                    const res = await fetch("http://localhost:8000/api/me/", {
                        headers: { "Authorization": `Token ${token}` }
                    });
                    if (res.ok) {
                        const user = await res.json();
                        setCurrentUser(user);
                    }
                } catch (e) {
                    console.error("Failed to fetch user", e);
                }
            }
            await fetchUpdates();
            setLoading(false);
        };
        init();

        // Background Refresh (2 mins)
        const interval = setInterval(() => {
            fetchUpdates();
        }, 120000);

        return () => clearInterval(interval);
    }, []);

    // Check for Denied/Returned Updates
    useEffect(() => {
        if (currentUser && updates.length > 0) {
            const myDenied = updates.filter(u => u.status === 'review' && u.created_by === currentUser.id);

            // Check if there are any *new* denied updates we haven't seen this session
            const newDenied = myDenied.filter(u => !seenDeniedIds.current.has(u.id));

            if (newDenied.length > 0) {
                // Determine if we should show the popup
                if (ignoreNextPopup.current) {
                    // We just performed the action (self-moderation), so suppress popup
                    ignoreNextPopup.current = false;
                } else {
                    setMyDeniedUpdates(myDenied);
                    setDeniedUpdateOpen(true);
                }
                // Mark these as seen so they don't spam on every refresh
                newDenied.forEach(u => seenDeniedIds.current.add(u.id));
            }
        }
    }, [currentUser, updates]);


    const handleAction = async (id: number, action: string, payload: any = {}) => {
        setActionLoading(true);
        const token = localStorage.getItem("authToken");

        if (action === 'deny') {
            ignoreNextPopup.current = true;
            // Also add to session storage so Dashboard doesn't show it either
            const ignored = JSON.parse(sessionStorage.getItem("ignoredDeniedIds") || "[]");
            if (!ignored.includes(id)) {
                ignored.push(id);
                sessionStorage.setItem("ignoredDeniedIds", JSON.stringify(ignored));
            }
        }

        try {
            const res = await fetch(`http://localhost:8000/api/updates/${id}/${action}/`, {
                method: "POST",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                fetchUpdates();
                setReturnDialogOpen(false);
                setReturnReason("");
                setSelectedUpdateId(null);
            }
        } catch (err) {
            console.error(`Failed to ${action} update`, err);
        } finally {
            setActionLoading(false);
        }
    };

    const canManage = currentUser?.is_superuser || currentUser?.is_staff || currentUser?.department === 'HQ';

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'live': return 'bg-green-500 hover:bg-green-600';
            case 'pending': return 'bg-amber-500 hover:bg-amber-600';
            case 'review': return 'bg-purple-500 hover:bg-purple-600';
            case 'inactive': return 'bg-slate-500 hover:bg-slate-600';
            case 'deleted': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-slate-500';
        }
    };

    const StatusBadge = ({ status }: { status: string }) => (
        <Badge className={`${getStatusColor(status)} text-white border-none shadow-sm capitalize`}>
            {status === 'review' ? 'Returned for Review' : status}
        </Badge>
    );

    const filteredUpdates = (status: string) => updates.filter(u => u.status === status);

    const UpdateCard = ({ update }: { update: Update }) => (
        <Card className="overflow-hidden flex flex-col group hover:shadow-md transition-all">
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
                    <StatusBadge status={update.status} />
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <Badge variant="secondary" className="bg-white/90 text-slate-800 backdrop-blur-sm shadow-sm">{update.category}</Badge>
                </div>
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

            <CardContent className="pb-4 flex-grow space-y-3">
                <p className="text-sm text-slate-600 line-clamp-3">{update.description}</p>
                {update.status === 'review' && update.rejection_reason && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-xs tex-red-700">
                        <span className="font-bold block text-red-800 mb-1">Feedback:</span>
                        {update.rejection_reason}
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-0 border-t border-slate-50 mt-auto p-4 bg-slate-50/50 flex flex-wrap gap-2">
                {update.status !== 'deleted' && (
                    <div className="flex w-full gap-2">
                        <Link href={`/admin/updates/${update.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">Edit</Button>
                        </Link>

                        {(currentUser?.id === update.created_by && (update.status === 'pending' || update.status === 'review')) && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete this update?")) {
                                        handleAction(update.id, 'delete_soft');
                                    }
                                }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                )}

                {canManage && (
                    <div className="w-full flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-100">
                        {update.status === 'pending' && (
                            <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex-1" onClick={() => handleAction(update.id, 'approve')}>
                                    <Check className="w-4 h-4 mr-1" /> Approve
                                </Button>
                                <Button size="sm" variant="destructive" className="flex-1" onClick={() => {
                                    setSelectedUpdateId(update.id);
                                    setReturnDialogOpen(true);
                                }}>
                                    <RotateCcw className="w-4 h-4 mr-1" /> Return
                                </Button>
                            </>
                        )}

                        {update.status === 'live' && (
                            <Button size="sm" variant="outline" className="flex-1 text-slate-600" onClick={() => handleAction(update.id, 'deactivate')}>
                                <Power className="w-4 h-4 mr-1" /> Deactivate
                            </Button>
                        )}

                        {update.status === 'live' && (
                            <Button size="sm" variant="ghost" className="text-amber-600 hover:bg-amber-50" onClick={() => {
                                setSelectedUpdateId(update.id);
                                setReturnDialogOpen(true);
                            }}>
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        )}

                        {(update.status === 'inactive' || update.status === 'review') && (
                            <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex-1" onClick={() => handleAction(update.id, 'activate')}>
                                    <Power className="w-4 h-4 mr-1" /> Activate
                                </Button>
                                {update.status === 'inactive' && (
                                    <Button size="sm" variant="ghost" className="text-amber-600 hover:bg-amber-50" onClick={() => {
                                        setSelectedUpdateId(update.id);
                                        setReturnDialogOpen(true);
                                    }}>
                                        <RotateCcw className="w-4 h-4" />
                                    </Button>
                                )}
                            </>
                        )}

                        {update.status === 'deleted' ? (
                            <Button size="sm" variant="outline" className="flex-1" onClick={() => handleAction(update.id, 'restore')}>
                                <RotateCcw className="w-4 h-4 mr-1" /> Restore
                            </Button>
                        ) : (
                            /* Admin delete button - only show if not already shown above logic? Or show both? 
                               Actually, if I am admin AND owner, I might see two delete buttons. 
                               Let's allow existing admin delete button to remain for admins primarily. 
                               If I am admin and owner, the top one is nicer for "my updates". 
                               The bottom one is "admin actions".
                            */
                            <>
                                {/* Keep admin delete button separate */}
                                {!((currentUser?.id === update.created_by && (update.status === 'pending' || update.status === 'review'))) && (
                                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleAction(update.id, 'delete_soft')}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                )}
            </CardFooter>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Updates Portal</h2>
                    <p className="text-slate-500">Manage news, volunteer schedules, and gallery uploads.</p>
                </div>
                <Link href="/admin/updates/new">
                    <Button className="bg-[#8b1d2c] hover:bg-[#6d1722] gap-2">
                        <Plus className="w-4 h-4" /> New Update
                    </Button>
                </Link>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-slate-100 p-1 rounded-xl mb-6">
                    <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#8b1d2c] data-[state=active]:shadow-sm">
                        Pending ({filteredUpdates('pending').length})
                    </TabsTrigger>
                    <TabsTrigger value="live" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#8b1d2c] data-[state=active]:shadow-sm">
                        Live ({filteredUpdates('live').length})
                    </TabsTrigger>
                    <TabsTrigger value="review" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#8b1d2c] data-[state=active]:shadow-sm">
                        Resent for Review ({filteredUpdates('review').length})
                    </TabsTrigger>
                    <TabsTrigger value="inactive" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#8b1d2c] data-[state=active]:shadow-sm">
                        Inactive ({filteredUpdates('inactive').length})
                    </TabsTrigger>
                    <TabsTrigger value="deleted" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#8b1d2c] data-[state=active]:shadow-sm">
                        Deleted ({filteredUpdates('deleted').length})
                    </TabsTrigger>
                </TabsList>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="animate-spin text-slate-400 w-8 h-8" />
                    </div>
                ) : (
                    ['pending', 'live', 'review', 'inactive', 'deleted'].map(status => (
                        <TabsContent key={status} value={status} className="mt-0">
                            {filteredUpdates(status).length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                                    <p className="text-slate-500 mb-4">No {status} updates found.</p>
                                    {status === 'pending' && (
                                        <Link href="/admin/updates/new">
                                            <Button variant="outline">Create your first update</Button>
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredUpdates(status).map(update => (
                                        <UpdateCard key={update.id} update={update} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    ))
                )}
            </Tabs>

            {/* Return for Review Dialog */}
            <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Return for Review</DialogTitle>
                        <DialogDescription>
                            Provide a reason for returning this update. The user will be notified and can make changes.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder="e.g. Image quality is too low, please fix typos..."
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="min-h-[100px]"
                    />
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setReturnDialogOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            disabled={!returnReason || actionLoading}
                            onClick={() => selectedUpdateId && handleAction(selectedUpdateId, 'deny', { reason: returnReason })}
                        >
                            {actionLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Return Update"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Action Required: Denied/Returned Updates Popup */}
            <Dialog open={deniedUpdateOpen} onOpenChange={setDeniedUpdateOpen}>
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
                        {myDeniedUpdates.map(u => (
                            <div key={u.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <h4 className="font-medium text-slate-800 text-sm">{u.title}</h4>
                                <p className="text-xs text-red-600 mt-1 font-semibold">{u.rejection_reason}</p>
                                <Link href={`/admin/updates/${u.id}`} onClick={() => setDeniedUpdateOpen(false)}>
                                    <Button size="sm" variant="link" className="p-0 h-auto text-[#8b1d2c] mt-2">Open & Fix</Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setDeniedUpdateOpen(false)}>Ignore</Button>
                        <Button
                            className="bg-[#8b1d2c] hover:bg-[#6d1722]"
                            onClick={() => {
                                setDeniedUpdateOpen(false);
                                if (myDeniedUpdates.length === 1) {
                                    router.push(`/admin/updates/${myDeniedUpdates[0].id}`);
                                } else {
                                    setActiveTab("review");
                                }
                            }}
                        >
                            {myDeniedUpdates.length === 1 ? "Edit & Resubmit" : "View All"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
