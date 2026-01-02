"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="bg-[#1e293b] text-white py-2 border-b border-slate-700">
            <div className="container mx-auto px-4 flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 opacity-80">
                    <Globe className="h-3 w-3" />
                    <span className="hidden sm:inline">Select your language / Selecione o seu idioma</span>
                </div>

                <div className="flex items-center gap-4 font-medium">
                    <button
                        onClick={() => setLanguage("en")}
                        className={`flex items-center gap-1.5 transition-colors hover:text-amber-400 ${language === "en" ? "text-amber-500 font-bold" : "text-slate-400"}`}
                    >
                        🇺🇸 English
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                        onClick={() => setLanguage("pt")}
                        className={`flex items-center gap-1.5 transition-colors hover:text-amber-400 ${language === "pt" ? "text-amber-500 font-bold" : "text-slate-400"}`}
                    >
                        🇲🇿 Português
                    </button>
                </div>
            </div>
        </div>
    );
}
