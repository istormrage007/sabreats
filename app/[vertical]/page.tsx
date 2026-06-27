import { notFound } from "next/navigation";
import { StorefrontContent } from "@/components/menu/StorefrontContent";
import { isVerticalId } from "@/types/vertical";

interface VerticalPageProps {
  params: Promise<{ vertical: string }>;
}

export default async function VerticalPage({ params }: VerticalPageProps) {
  const { vertical } = await params;
  if (!isVerticalId(vertical)) {
    notFound();
  }
  return <StorefrontContent vertical={vertical} />;
}
