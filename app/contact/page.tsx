"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafd]">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full flex flex-col items-center justify-center text-center px-4">
                <div className="absolute inset-0 z-0 bg-slate-900">
                    <Image
                        src="/hero.png"
                        alt="Contact Background"
                        fill
                        className="object-cover opacity-40 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/90" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                        <span className="text-xs font-medium uppercase tracking-wider text-amber-500">Connect</span>
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-slate-200 font-light">
                        We'd love to hear from you. Reach out to us with any questions or prayer requests.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto py-20 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

                    {/* Left Side - Contact Info Cards */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <h2 className="text-2xl font-bold text-slate-900">Contact Information</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card className="border-none shadow-md hover:shadow-lg transition-shadow h-full">
                                <CardContent className="p-6 flex flex-col items-start gap-4 h-full">
                                    <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-900">Visit Us</h3>
                                        <p className="text-slate-600 mt-1 text-sm">
                                            ADA Headquarters<br />
                                            123 Faith Avenue<br />
                                            Cape Town, 8001
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md hover:shadow-lg transition-shadow h-full">
                                <CardContent className="p-6 flex flex-col items-start gap-4 h-full">
                                    <div className="bg-green-50 p-3 rounded-full text-green-600">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-900">Call Us</h3>
                                        <div className="text-slate-600 mt-1 space-y-1 text-sm">
                                            <p>+27 21 123 4567</p>
                                            <p>+27 82 987 6543</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md hover:shadow-lg transition-shadow h-full">
                                <CardContent className="p-6 flex flex-col items-start gap-4 h-full">
                                    <div className="bg-purple-50 p-3 rounded-full text-purple-600">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-900">Email Us</h3>
                                        <p className="text-slate-600 mt-1 text-sm">
                                            info@ada-church.org
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md hover:shadow-lg transition-shadow h-full">
                                <CardContent className="p-6 flex flex-col items-start gap-4 h-full">
                                    <div className="bg-amber-50 p-3 rounded-full text-amber-600">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-900">Office Hours</h3>
                                        <p className="text-slate-600 mt-1 text-sm">
                                            Monday - Friday<br />
                                            8:00 AM - 5:00 PM
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Send us a Message</h2>
                            <p className="text-slate-500 mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                                        <Input id="name" placeholder="John Doe" required className="bg-slate-50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                                        <Input id="email" type="email" placeholder="john@example.com" required className="bg-slate-50" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject <span className="text-slate-400 font-normal">(Optional)</span></Label>
                                    <Input id="subject" placeholder="How can we help?" className="bg-slate-50" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Type your message here..."
                                        className="min-h-[150px] bg-slate-50 resize-y"
                                        required
                                    />
                                </div>

                                <Button size="lg" className="w-full md:w-auto min-w-[200px] h-12 bg-primary hover:bg-primary/90">
                                    <Send className="w-4 h-4 mr-2" /> Send Message
                                </Button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
