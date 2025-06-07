export default function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container flex flex-col items-center gap-4 py-10 md:h-16 md:flex-row md:text-center">
                <div className="text-center text-sm leading-loose text-muted-foreground md:text-center">
                    Built with ♥️ by PWT Book Party. © {new Date().getFullYear()} All rights reserved.
                </div>
            </div>
        </footer>
    )
}
