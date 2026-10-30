import { ReportView } from '@/components/report/ReportView';
import { cleanReportHandle, resolveKnownReport } from '@/lib/report-data';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ handle?: string | string[] }>;
};

/**
 * Report route. Profiles we already hold are resolved here so the developed
 * print ships in the first HTML response (fast LCP, no layout shift); the
 * client examines everything else.
 */
export default async function ReportPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const handleParam = Array.isArray(sp.handle) ? sp.handle[0] : sp.handle;
  const rawId = decodeURIComponent(id || '');
  const cleanHandle = cleanReportHandle(handleParam || rawId);
  const initial = cleanHandle ? resolveKnownReport(cleanHandle) : null;
  return <ReportView key={cleanHandle} rawId={rawId} cleanHandle={cleanHandle} initial={initial} />;
}
