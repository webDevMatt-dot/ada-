"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2, ArrowLeft, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function NewUpdatePage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("category", formData.category);
            data.append("description", formData.description);
            if (imageFile) {
                data.append("image", imageFile);
            }

            const res = await fetch("/api/updates", {
                method: "POST",
                headers: {
                    "Authorization": `Token ${token}`,
                },
                body: data,
            });

            if (res.ok) {
                router.push("/admin/updates");
                router.refresh();
            } else {
                const errorData = await res.text();
                console.error("Failed to create update:", errorData);
                // Optional: set form error state to display to user
            }
        } catch (error) {
            console.error("Error submitting form", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/updates">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Create New Update</h2>
                    <p className="text-slate-500">Share news with the congregation.</p>
                </div>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6 pt-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Youth Conference Recap"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val) => setFormData({ ...formData, category: val })}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="announcement">Announcement</SelectItem>
                                    <SelectItem value="newsletter">Newsletter</SelectItem>
                                    <SelectItem value="gallery">Gallery</SelectItem>
                                    <SelectItem value="apostle">Apostle's Update</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label>Featured Image / Flyer</Label>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 transition-colors hover:bg-slate-50 cursor-pointer text-center relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                    required
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <div className="p-3 bg-slate-100 rounded-full group-hover:bg-white transition-colors">
                                        <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-[#8b1d2c]" />
                                    </div>
                                    {imageFile ? (
                                        <p className="text-sm font-medium text-[#8b1d2c]">{imageFile.name}</p>
                                    ) : (
                                        <>
                                            <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                                            <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter the details of the update..."
                                className="min-h-[150px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 border-t bg-slate-50 py-4">
                        <Link href="/admin/updates">
                            <Button variant="ghost" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={loading} className="bg-[#8b1d2c] hover:bg-[#6d1722]">
                            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Publish Update"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
