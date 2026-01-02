import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export const metadata = {
    title: 'Our History - ADA Church',
    description: 'The story of Assembleia de Deus Africana and our journey of faith.',
}

export default function HistoryPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full flex flex-col items-center justify-center text-center px-4">
                {/* Background Image/Overlay */}
                <div className="absolute inset-0 z-0 bg-slate-900">
                    <Image
                        src="/hero.png"
                        alt="History Background"
                        fill
                        className="object-cover opacity-40 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/90" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                        <span className="text-xs font-medium uppercase tracking-wider text-amber-500">Legacy</span>
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                        Our History
                    </h1>
                    <p className="text-lg text-slate-200 font-light max-w-2xl mx-auto">
                        Celebrating decades of God's faithfulness and the growth of His church in Mozambique.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto max-w-4xl px-4 py-16 space-y-16">

                {/* Intro */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-800 font-serif">A Journey of Faith</h2>
                    <p className="text-slate-600 leading-relaxed text-lg">
                        The Assembleia de Deus Africana (ADA) has a rich history rooted in the Great Commission. From humble beginnings to a nationwide movement, our story is a testament to the power of the Gospel and the dedication of faithful servants.
                    </p>
                </div>

                {/* Timeline Placeholder */}
                <div className="relative border-l-2 border-slate-200 ml-4 md:ml-0 md:pl-0 space-y-12">

                    {/* Item 1 */}
                    <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-12 pl-8 md:pl-0">
                        <div className="absolute left-[-9px] top-0 md:static md:w-1/2 md:text-right md:pr-12">
                            <span className="hidden md:inline-block text-4xl font-bold text-[#8b1d2c]/20">19XX</span>
                        </div>
                        <div className="absolute left-[-9px] top-2 md:left-1/2 md:-ml-[9px] h-4 w-4 rounded-full bg-[#8b1d2c] border-2 border-white shadow-sm z-10" />
                        <div className="md:w-1/2 md:pl-12 space-y-2">
                            <Badge variant="outline" className="md:hidden mb-2 text-[#8b1d2c] border-[#8b1d2c]/20">19XX</Badge>
                            <h3 className="text-xl font-bold text-slate-800">The Beginning</h3>
                            <p className="text-slate-600">
                                The church was founded with a vision to reach the local community with the transformative message of Jesus Christ. Early gatherings were held in homes, marked by fervent prayer and evangelism.
                            </p>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-12 pl-8 md:pl-0">
                        <div className="absolute left-[-9px] top-0 md:static md:w-1/2 md:text-right md:pr-12">
                            <div className="md:w-full space-y-2">
                                <h3 className="text-xl font-bold text-slate-800">Expansion & Growth</h3>
                                <p className="text-slate-600">
                                    As the congregation grew, new assemblies were planted across the city. This period saw the establishment of our first permanent sanctuary and the formal organization of church leadership.
                                </p>
                            </div>
                        </div>
                        <div className="absolute left-[-9px] top-2 md:left-1/2 md:-ml-[9px] h-4 w-4 rounded-full bg-[#c29c21] border-2 border-white shadow-sm z-10" />
                        <div className="md:w-1/2 md:pl-12">
                            <span className="hidden md:inline-block text-4xl font-bold text-[#c29c21]/20">19XX</span>
                            <Badge variant="outline" className="md:hidden mb-2 text-[#c29c21] border-[#c29c21]/20">19XX</Badge>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-12 pl-8 md:pl-0">
                        <div className="absolute left-[-9px] top-0 md:static md:w-1/2 md:text-right md:pr-12">
                            <span className="hidden md:inline-block text-4xl font-bold text-slate-200">20XX</span>
                        </div>
                        <div className="absolute left-[-9px] top-2 md:left-1/2 md:-ml-[9px] h-4 w-4 rounded-full bg-slate-300 border-2 border-white shadow-sm z-10" />
                        <div className="md:w-1/2 md:pl-12 space-y-2">
                            <Badge variant="outline" className="md:hidden mb-2 text-slate-500">20XX</Badge>
                            <h3 className="text-xl font-bold text-slate-800">Present Day</h3>
                            <p className="text-slate-600">
                                Today, ADA continues to thrive as a beacon of hope, with ministries serving men, women, youth, and children. We remain committed to our founding principles while embracing new ways to serve our generation.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
