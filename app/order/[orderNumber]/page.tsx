import { OrderContent } from "@/components/reveal/OrderContent";

interface OrderDetailPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderNumber } = await params;
  return <OrderContent orderNumber={orderNumber} />;
}
