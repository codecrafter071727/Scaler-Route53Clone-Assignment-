import { ComingSoonContent } from "@/features/route53/components/coming-soon-content";
import { titleForPath } from "@/features/route53/data/nav-data";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ page: string }>;
};

export default async function TrafficFlowPage({ params }: Props) {
  const { page } = await params;
  const path = `/traffic-flow/${page}`;
  const title = titleForPath(path);
  if (!title) notFound();
  return <ComingSoonContent title={title} />;
}
