"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="border-t bg-background py-8">
            <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-sm text-balance text-center leading-loose text-muted-foreground md:text-left">
                    &copy; {new Date().getFullYear()} Assembleia de Deus Africana. All rights reserved.
                </p>
                <div className="flex gap-6 items-center">
                    <Link
                        href="/admin/login"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {t("nav.login")}
                    </Link>
                </div>
            </div>
        </footer>
    )
}
