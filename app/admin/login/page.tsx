"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useLanguage();

    useEffect(() => {
        const reason = searchParams.get("reason");
        if (reason === "timeout") {
            setError(t("nav.sessionExpired"));
        }
    }, [searchParams, t]);

    const [failedAttempts, setFailedAttempts] = useState(0);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Use relative path to leverage Next.js rewrites (proxies to backend)
            // This works for localhost, local network (mobile), and production.
            const apiUrl = "/api/login";

            const res = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("authToken", data.token);
                // Clear notification suppression flags so new session gets fresh popups
                sessionStorage.removeItem("ignoredDeniedPopup");
                sessionStorage.removeItem("ignoredDeniedIds");

                // Redirect to the main admin dashboard
                router.push("/admin");
            } else {
                const newAttempts = failedAttempts + 1;
                setFailedAttempts(newAttempts);

                if (newAttempts > 2) {
                    router.push("/");
                    return;
                }

                // Show actual error for debugging
                const errorText = await res.text();
                setError(`Login failed: ${res.status} ${res.statusText} - ${errorText.substring(0, 100)}`);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-slate-200">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto bg-[#8b1d2c]/10 p-4 rounded-full w-fit mb-2">
                        <Lock className="w-8 h-8 text-[#8b1d2c]" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800">ADA Portal</CardTitle>
                    <CardDescription>Sign in to manage the church website</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Username</label>
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="h-11"
                            />
                        </div>
                        {error && <p className="text-sm text-red-500 text-center bg-red-50 p-3 rounded-lg font-medium">{error}</p>}
                    </CardContent>
                    <CardFooter className="pb-8">
                        <Button type="submit" className="w-full bg-[#8b1d2c] hover:bg-[#6d1722] text-white h-11 text-base font-medium transition-colors" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : "Sign In"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
