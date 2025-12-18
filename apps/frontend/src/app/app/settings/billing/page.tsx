import type { Metadata } from "next";

import { BillingClient } from "./client";

export const metadata: Metadata = {
  title: "Billing & Plans | Optiq",
};

export default function BillingPage() {
  return <BillingClient />;
}
