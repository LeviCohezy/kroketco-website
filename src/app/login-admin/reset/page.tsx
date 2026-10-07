import Link from "next/link";
import { isResetTokenValid } from "@/lib/password-reset";
import ResetForm from "./ResetForm";

export const dynamic = "force-dynamic";

// Landing page of the e-mailed reset link: choose a new admin password.
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  const valid = isResetTokenValid(token);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--light-blue)] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[0_20px_50px_-20px_rgba(14,75,58,0.4)]">
        <div className="mb-6 text-center">
          <div className="text-xl font-bold tracking-tight text-orange">Kroketco</div>
          <p className="mt-1 text-sm text-forest/60">Nieuw wachtwoord kiezen</p>
        </div>
        {valid ? (
          <ResetForm token={token} />
        ) : (
          <>
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              Deze link is verlopen of al gebruikt. Resetlinks zijn 15 minuten geldig en werken één keer.
            </p>
            <Link href="/login-admin/vergeten" className="mt-5 block text-center text-sm font-medium text-orange hover:underline">
              Nieuwe resetlink aanvragen
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
