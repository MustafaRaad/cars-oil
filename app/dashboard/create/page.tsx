import Link from "next/link";

import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { Button } from "@/components/ui/button";

export default function CreateCustomerPage() {
  return (
    <main className="space-y-4">
      <div className="mx-auto w-full max-w-7xl px-4 pt-4 md:px-6">
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Customers</Link>
        </Button>
      </div>
      <DashboardClient />
    </main>
  );
}
