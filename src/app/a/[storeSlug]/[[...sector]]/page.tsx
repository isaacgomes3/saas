import Link from "next/link";
import { AttendantSession } from "@/components/session/AttendantSession";
import { getStoreBySlug } from "@/lib/stores";

type PageProps = {
  params: Promise<{ storeSlug: string; sector?: string[] }>;
};

export default async function AttendantPage({ params }: PageProps) {
  const { storeSlug, sector } = await params;
  const store = getStoreBySlug(storeSlug);
  const sectorId = sector?.[0];

  if (!store) {
    return (
      <div className="not-found">
        <h1>Loja não encontrada</h1>
        <p>Verifique o QR Code ou o link de atendimento.</p>
        <Link href="/" className="btn-primary">
          Voltar para Presença
        </Link>
      </div>
    );
  }

  return <AttendantSession store={store} sectorId={sectorId} />;
}
