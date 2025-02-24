"use client";

import dynamic from 'next/dynamic';

const HomeClient = dynamic(
  () => import('@/components/pages/HomeClient'),
  { ssr: false }
);

export default function Home() {
  return <HomeClient />;
}
