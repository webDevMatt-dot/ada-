
import { Hero } from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Welcome / About Section */}
      <section className="pt-32 pb-20 bg-background">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Assembleia de Deus Africana is a vibrant community dedicated to spreading the Gospel and serving our neighbors.
            Whether you are exploring faith for the first time or looking for a church home, you are welcome here.
          </p>
          <Button variant="outline">Learn More About Us</Button>
        </div>
      </section>

      {/* Service Times Grid */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Join Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calendar className="h-10 w-10 text-primary" />}
              title="Service Times"
              description="Sunday Service: 10:00 AM & 6:00 PM"
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Community Groups"
              description="Connect with others in our midweek small groups."
            />
            <FeatureCard
              icon={<Heart className="h-10 w-10 text-primary" />}
              title="Serve"
              description="Discover your gifts and find a place to serve."
            />
          </div>
        </div>
      </section>
    </div>
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
