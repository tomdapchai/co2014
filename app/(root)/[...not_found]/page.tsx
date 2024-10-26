import Link from "next/link";

export default function page() {
    return (
        <div>
            <h1>Not found – 404!</h1>
            <div>
                <Link href="/dashboard">Go back to Home</Link>
            </div>
        </div>
    );
}
