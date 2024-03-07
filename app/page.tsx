"use client"
import dynamic from 'next/dynamic'

const Timer = dynamic(() => import("@/components/timer"), { ssr: false })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 " >
      <Timer />
    </main>
  );
}
