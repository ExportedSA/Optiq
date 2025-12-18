import type { Metadata } from "next";

import { WasteClient } from "./client";

export const metadata: Metadata = {
  title: "Waste Detection | Optiq",
};

export default function WastePage() {
  return <WasteClient />;
}
