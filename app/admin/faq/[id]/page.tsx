"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditFAQPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        category: "General",
        order: 0
    });

    useEffect(() => {
        const fetchFAQ = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                router.push("/admin/login");
                return;
            }

            try {
                const res = await fetch(`/api/faqs/${resolvedParams.id}/`, {
                    headers: { "Authorization": `Token ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        question: data.question,
                        answer: data.answer,
                        category: data.category,
                        order: data.order
                    });
                } else {
                    alert("Failed to load FAQ");
                    router.push("/admin/faq");
                }
            } catch (error) {
                console.error("Failed to fetch FAQ", error);
            } finally {
                setFetching(false);
            }
        };

        fetchFAQ();
    }, [resolvedParams.id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("authToken");

        try {
            const res = await fetch(`/api/faqs/${resolvedParams.id}/`, {
                method: "PUT",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push("/admin/faq");
            } else {
                alert("Failed to update FAQ");
            }
        } catch (error) {
            console.error("Failed to update FAQ", error);
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
                <Link href="/admin/faq">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold text-slate-800">Edit FAQ</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Edit FAQ</CardTitle>
                    <CardDescription>Update this frequently asked question.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="General">General</SelectItem>
                                    <SelectItem value="Services">Services</SelectItem>
                                    <SelectItem value="Membership">Membership</SelectItem>
                                    <SelectItem value="Beliefs">Beliefs</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="question">Question</Label>
                            <Input
                                id="question"
                                required
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="answer">Answer</Label>
                            <Textarea
                                id="answer"
                                required
                                rows={5}
                                value={formData.answer}
                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="order">Sort Order</Label>
                            <Input
                                id="order"
                                type="number"
                                required
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            />
                        </div>

                        <Button type="submit" className="w-full bg-[#8b1d2c] hover:bg-[#6d1722]" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Update FAQ
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
