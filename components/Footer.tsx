
export function Footer() {
    return (
        <footer className="border-t bg-background py-8">
            <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-sm text-balance text-center leading-loose text-muted-foreground md:text-left">
                    &copy; {new Date().getFullYear()} Assembleia de Deus Africana. All rights reserved.
                </p>
                <div className="flex gap-4">
                    {/* Social links placeholder */}
                </div>
            </div>
        </footer>
    )
}
