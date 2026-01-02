"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { translations, Language } from "@/lib/translations";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    // Load saved preference
    useEffect(() => {
        const savedLang = localStorage.getItem("ada-language") as Language;
        if (savedLang && (savedLang === "en" || savedLang === "pt")) {
            setLanguage(savedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("ada-language", lang);
    };

    // Helper to access nested keys (e.g. "nav.home")
    const t = (key: string): string => {
        const keys = key.split(".");
        let value: any = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`Translation missing for key: ${key} in ${language}`);
                return key;
            }
        }

        return value as string;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
