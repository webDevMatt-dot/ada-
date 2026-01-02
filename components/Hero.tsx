
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Church, Users, Globe, BookOpen } from "lucide-react";

export function Hero() {
    return (
        <div className="relative min-h-[700px] w-full flex flex-col items-center justify-center overflow-visible">
            {/* Background Image with Dark Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero.png"
                    alt="Worship Background"
                    fill
                    className="object-cover brightness-[0.3]"
                    priority
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto flex flex-col items-center gap-6 pt-20 pb-32">
                {/* Top Badge */}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-4">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-medium uppercase tracking-wider">African Assembly of God</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                    Forward in Faith
                </h1>

                <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
                    African Assembly of God - Spreading the Gospel across Mozambique and beyond
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <Button size="lg" className="bg-[#8b1d2c] hover:bg-[#6d1722] text-white border-none px-8 h-12">
                        <Heart className="mr-2 h-4 w-4" /> Receive Jesus
                    </Button>
                    <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 px-8 h-12">
                        <MapPin className="mr-2 h-4 w-4" /> Find a Location
                    </Button>
                </div>
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 z-20">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatItem icon={<Church className="text-[#8b1d2c]" />} count="100+" label="Churches" />
                    <StatItem icon={<Users className="text-[#8b1d2c]" />} count="50,000+" label="Members" />
                    <StatItem icon={<Globe className="text-[#8b1d2c]" />} count="11" label="Provinces" />
                    <StatItem icon={<BookOpen className="text-[#8b1d2c]" />} count="70+" label="Years of Ministry" />
                </div>
            </div>
        </div>
    );
}

function StatItem({ icon, count, label }: { icon: React.ReactNode; count: string; label: string }) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="mb-3 bg-gray-50 p-3 rounded-xl">
                {icon}
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">{count}</div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">{label}</div>
        </div>
    );
}
