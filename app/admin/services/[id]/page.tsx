'use client'

import { useParams } from "next/navigation"

export default function Page() {
    const { id } = useParams();
    return (
        <main>
            <h1>
                {"Service " + id}
            </h1>
        </main>
    )
}
