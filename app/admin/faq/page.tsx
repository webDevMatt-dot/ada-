"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Loader2, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
    order: number;
}

export default function FAQAdminPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchFaqs = async () => {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        try {
            const res = await fetch("/api/faqs/", {
                headers: { "Authorization": `Token ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFaqs(data);
            }
        } catch (error) {
            console.error("Failed to fetch FAQs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this FAQ?")) return;

        const token = localStorage.getItem("authToken");
        try {
            const res = await fetch(`/api/faqs/${id}/`, {
                method: "DELETE",
                headers: { "Authorization": `Token ${token}` }
            });

            if (res.ok) {
                fetchFaqs(); // Refresh list
            } else {
                alert("Failed to delete FAQ");
            }
        } catch (error) {
            console.error("Failed to delete FAQ", error);
        }
    };

    const getCategoryBadge = (category: string) => {
        const colors: Record<string, string> = {
            "General": "bg-slate-100 text-slate-600",
            "Services": "bg-blue-100 text-blue-600",
            "Membership": "bg-green-100 text-green-600",
            "Beliefs": "bg-purple-100 text-purple-600",
            "Other": "bg-amber-100 text-amber-600",
        };
        return colors[category] || "bg-gray-100 text-gray-600";
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">FAQ Management</h2>
                    <p className="text-slate-500">Manage frequently asked questions.</p>
                </div>
                <Link href="/admin/faq/new">
                    <Button className="bg-[#8b1d2c] hover:bg-[#6d1722] gap-2">
                        <Plus className="w-4 h-4" /> Add FAQ
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="animate-spin text-slate-400 w-8 h-8" />
                </div>
            ) : (
                <div className="md:masonry-2-col lg:masonry-3-col box-border mx-auto before:box-inherit after:box-inherit space-y-6">
                    <div className="grid gap-4">
                        {faqs.length === 0 && (
                            <Card className="col-span-full p-8 text-center text-slate-500 border-dashed">
                                <p>No FAQs found. creating one!</p>
                            </Card>
                        )}
                        {faqs.map((faq) => (
                            <Card key={faq.id} className="hover:shadow-md transition-shadow group relative">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start gap-4">
                                        <Badge className={`rounded px-2 py-0.5 text-xs font-bold border-none hover:bg-opacity-80 ${getCategoryBadge(faq.category)}`}>
                                            {faq.category}
                                        </Badge>
                                        <div className="flex gap-2">
                                            <Link href={`/admin/faq/${faq.id}`}>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600" onClick={() => handleDelete(faq.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg pt-2 leading-tight">{faq.question}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-500 text-sm line-clamp-3">{faq.answer}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
