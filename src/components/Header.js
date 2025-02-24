import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-bordeaux text-white p-4 shadow-lg">
            <nav className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    MétéoApp
                </Link>
                <div className="space-x-6">
                    <Link href="/stations" className="hover:underline">Stations</Link>
                    <Link href="/login" className="hover:underline">Se connecter</Link>
                </div>
            </nav>
        </header>
    );
}
