// export default function Footer() {
//     return (
//         <footer className="bg-secondary text-secondary-foreground">
//             <div className="container mx-auto px-4 py-4 text-center">
//                 <p>&copy; 2024 Library Management System. All rights reserved.</p>
//             </div>
//         </footer>
//     )
// }


export default function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container flex flex-col items-center gap-4 py-10 md:h-16 md:flex-row md:py-0">
                <div className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built with ♥️ by Your Library Team. © {new Date().getFullYear()} All rights reserved.
                </div>
            </div>
        </footer>
    )
}
