"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Heart } from "lucide-react";

export function HomeContent() {
    const { t } = useLanguage();
    return (
        <section className="pt-20 pb-20 bg-background">
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <h2 className="text-3xl font-bold mb-6">{t('home.whoWeAre')}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    {t('home.whoWeAreText')}
                </p>
                <Button variant="outline">{t('home.learnMore')}</Button>
            </div>
        </section>
    );
}

export function ServicesContent() {
    const { t } = useLanguage();
    return (
        <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">{t('home.joinUs')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Calendar className="h-10 w-10 text-primary" />}
                        title={t('home.serviceTimes')}
                        description={t('home.serviceTimesDesc')}
                    />
                    <FeatureCard
                        icon={<Users className="h-10 w-10 text-primary" />}
                        title={t('home.communityGroups')}
                        description={t('home.communityGroupsDesc')}
                    />
                    <FeatureCard
                        icon={<Heart className="h-10 w-10 text-primary" />}
                        title={t('home.serve')}
                        description={t('home.serveDesc')}
                    />
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
            <div className="mb-4 bg-primary/10 p-4 rounded-full">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    )
}
