import Link from "next/link";
import { ArrowIcon, PawIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-cream pt-20">
      <div className="container-xl text-center">
        <PawIcon className="mx-auto h-10 w-10 text-beige" />
        <h1 className="heading-display mt-6 text-[clamp(2rem,4vw,3rem)] text-dark">
          هذه الصفحة غير موجودة
        </h1>
        <p className="mt-4 text-dark/60">يبدو أن الرابط الذي اتبعته غير صحيح أو تم نقل الصفحة.</p>
        <Link href="/" className="btn btn-primary mt-8">
          العودة للرئيسية
          <ArrowIcon className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
