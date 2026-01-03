"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, ArrowLeft, UploadCloud, AlertCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UpdateData {
    id: number;
    title: string;
    description: string;
    category: string;
    image: string | null;
    status: 'pending' | 'live' | 'review' | 'inactive' | 'deleted';
    rejection_reason?: string;
}

export default function EditUpdatePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [status, setStatus] = useState<string>("");
    const [rejectionReason, setRejectionReason] = useState<string | null>(null);
    const [initialData, setInitialData] = useState<any>(null);

    useEffect(() => {
        const fetchUpdate = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                router.push("/admin/login");
                return;
            }

            try {
                const res = await fetch(`http://localhost:8000/api/updates/${id}/`, {
                    headers: { "Authorization": `Token ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        title: data.title,
                        category: data.category,
                        description: data.description,
                    });
                    setInitialData({
                        title: data.title,
                        category: data.category,
                        description: data.description,
                    });
                    setCurrentImage(data.image);
                    setStatus(data.status);
                    setRejectionReason(data.rejection_reason);
                } else {
                    console.error("Failed to fetch update");
                    router.push("/admin/updates");
                }
            } catch (error) {
                console.error("Error fetching update", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUpdate();
        }
    }, [id, router]);

    const hasChanges = () => {
        if (!initialData) return false;
        if (imageFile) return true; // New image selected
        return (
            formData.title !== initialData.title ||
            formData.category !== initialData.category ||
            formData.description !== initialData.description
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem("authToken");

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("category", formData.category);
            data.append("description", formData.description);
            if (imageFile) {
                data.append("image", imageFile);
            }

            const res = await fetch(`http://localhost:8000/api/updates/${id}/`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Token ${token}`,
                },
                body: data,
            });

            if (res.ok) {
                router.push("/admin/updates");
                router.refresh();
            } else {
                if (res.status === 401) {
                    localStorage.removeItem("authToken");
                    router.push("/admin/login");
                    return;
                }
                const errorText = await res.text();
                console.error("Failed to update:", errorText);
            }
        } catch (error) {
            console.error("Error submitting form", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this update? This action cannot be undone.")) return;

        const token = localStorage.getItem("authToken");
        try {
            const res = await fetch(`http://localhost:8000/api/updates/${id}/delete_soft/`, {
                method: "POST",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.ok) {
                router.push("/admin/updates");
                router.refresh();
            } else {
                console.error("Failed to delete update");
            }
        } catch (error) {
            console.error("Error deleting update", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="animate-spin text-slate-400 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/updates">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Edit Update</h2>
                        <p className="text-slate-500">Modify details or fix issues.</p>
                    </div>
                </div>
                {(status === 'pending' || status === 'review') && (
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                )}
            </div>

            {status === 'review' && rejectionReason && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Action Required: Update Returned for Review</AlertTitle>
                    <AlertDescription>
                        Reason: <strong>{rejectionReason}</strong>
                        <br />
                        Please edit the update below to address the feedback. Saving your changes will automatically resubmit it for approval.
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6 pt-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
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
                            {currentImage && !imageFile && (
                                <div className="mb-4 relative h-48 rounded-lg overflow-hidden border border-slate-200">
                                    <img src={currentImage} alt="Current" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 transition-colors hover:bg-slate-50 cursor-pointer text-center relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <div className="p-3 bg-slate-100 rounded-full group-hover:bg-white transition-colors">
                                        <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-[#8b1d2c]" />
                                    </div>
                                    {imageFile ? (
                                        <p className="text-sm font-medium text-[#8b1d2c]">{imageFile.name}</p>
                                    ) : (
                                        <>
                                            <p className="text-sm font-medium text-slate-700">
                                                {currentImage ? "Click to change image" : "Click to upload image"}
                                            </p>
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
                        <Button type="submit" disabled={saving || !hasChanges()} className="bg-[#8b1d2c] hover:bg-[#6d1722]">
                            {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : (status === 'review' ? "Resubmit for Approval" : "Save Changes")}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
