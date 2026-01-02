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


export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Locations", href: "/locations" },
        { name: "Events", href: "/events" },
        { name: "Updates", href: "/updates" },
        { name: "Our History", href: "/history" },
        { name: "About Us", href: "/about" },
        { name: "FAQ", href: "/faq" },
        { name: "Prayer Wall", href: "/prayer-wall" },
        { name: "Counselling", href: "/counselling" },
        { name: "Contact", href: "/contact" },
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
                        <Link key={item.href} href={item.href} className="text-sm font-medium hover:underline underline-offset-4">
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="hidden xl:flex">
                    <Link href="/receive-jesus">
                        <Button>Receive Jesus</Button>
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
                        <SheetContent side="right">
                            <VisuallyHidden.Root>
                                <SheetTitle>Menu</SheetTitle>
                            </VisuallyHidden.Root>
                            <div className="flex flex-col gap-4 mt-8">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-lg font-medium"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <Link href="/receive-jesus" onClick={() => setIsOpen(false)} className="w-full">
                                    <Button className="w-full">Receive Jesus</Button>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
