import type { Metadata } from "next";

import { RoiDashboardClient } from "./client";

export const metadata: Metadata = {
  title: "ROI Dashboard | Optiq",
};

export default function RoiDashboardPage() {
  return <RoiDashboardClient />;
}
