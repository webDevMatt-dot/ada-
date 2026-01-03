"use client"
import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"


import { useLanguage } from "@/context/LanguageContext";

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const { t } = useLanguage();

    const navItems = [
        { name: t("nav.home"), href: "/" },
        { name: t("nav.locations"), href: "/locations" },
        { name: t("nav.events"), href: "/events" },
        { name: t("nav.updates"), href: "/updates" },
        { name: t("nav.history"), href: "/history" },
        { name: t("nav.about"), href: "/about" },
        { name: t("nav.faq"), href: "/faq" },
        { name: t("nav.prayerWall"), href: "/prayer-wall" },
        { name: t("nav.counselling"), href: "/counselling" },
        { name: t("nav.contact"), href: "/contact" },
        { name: t("nav.finance"), href: "https://financas.ada.org.mz/", external: true },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        {/* Wrapper to reserve space in flow but allow overflow */}
                        <div className="relative h-16 w-24 flex items-center justify-center">
                            <div className="absolute top-0 h-24 w-auto flex items-center justify-center">
                                <img
                                    src="/ada_logo.png"
                                    alt="ADA Logo"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden xl:flex gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noopener noreferrer" : undefined}
                            className="text-sm font-medium hover:underline underline-offset-4"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="hidden xl:flex">
                    <Link href="/receive-jesus">
                        <Button>{t("nav.receiveJesus")}</Button>
                    </Link>
                </div>

                {/* Mobile Nav */}
                <div className="xl:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 border-l border-slate-200">
                            <VisuallyHidden.Root>
                                <SheetTitle>Menu</SheetTitle>
                            </VisuallyHidden.Root>

                            <div className="flex flex-col h-full bg-white">
                                {/* Mobile Menu Header */}
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 relative flex-shrink-0">
                                            <img
                                                src="/ada_logo.png"
                                                alt="ADA Logo"
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-slate-900 text-sm leading-none">ADA</span>
                                            <span className="block text-[10px] text-slate-500 font-medium mt-0.5">Church</span>
                                        </div>
                                    </div>
                                    {/* Close button is automatically added by SheetContent, but we can customize if needed */}
                                </div>

                                {/* Menu Items */}
                                <div className="flex-1 overflow-y-auto py-6 px-6">
                                    <div className="flex flex-col gap-1">
                                        {navItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                target={item.external ? "_blank" : undefined}
                                                rel={item.external ? "noopener noreferrer" : undefined}
                                                onClick={() => setIsOpen(false)}
                                                className="group flex items-center justify-between py-3 px-4 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                                            >
                                                <span className="text-base font-medium">{item.name}</span>
                                                <div className="h-1.5 w-1.5 rounded-full bg-slate-200 group-hover:bg-[#8b1d2c] transition-colors" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer / CTA */}
                                <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
                                    <Link href="/receive-jesus" onClick={() => setIsOpen(false)} className="w-full block">
                                        <Button className="w-full bg-[#8b1d2c] hover:bg-[#6d1722] text-white h-12 rounded-xl shadow-sm text-base">
                                            {t("nav.receiveJesus")}
                                        </Button>
                                    </Link>
                                    <p className="text-center text-xs text-slate-400 font-medium">
                                        &copy; {new Date().getFullYear()} ADA Church
                                    </p>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
