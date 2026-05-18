"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Button,
  Select,
  Divider,
  Box,
  SkeletonBodyText,
  SkeletonDisplayText,
  Banner,
  DataTable,
  Tooltip,
  Icon,
} from "@shopify/polaris";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  fetchMetrics,
  isLoggedIn,
  clearToken,
} from "../lib/api";
import type { DashboardMetrics } from "../lib/types";

const STATUS_COLORS: Record<string, string> = {
  new: "#2563eb",
  confirmed: "#16a34a",
  cancelled: "#dc2626",
  delivered: "#7c3aed",
  returned: "#ea580c",
};

const PIE_COLORS = ["#2563eb", "#16a34a", "#dc2626", "#7c3aed", "#ea580c", "#0891b2"];

function fmtDZD(n: number) {
  return `${n.toLocaleString("en-DZ")} DZD`;
}

function fmtPct(n: number) {
  return `${n.toFixed(2)}%`;
}

type Range = "7d" | "30d" | "90d";

function getRangeDates(range: Range): { fromDate: string; toDate: string } {
  const now = new Date();
  const to = now.toISOString().split("T")[0];
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const from = new Date(now.getTime() - (days - 1) * 86400000)
    .toISOString()
    .split("T")[0];
  return { fromDate: from, toDate: to };
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string;
  sub?: string;
  loading?: boolean;
  tone?: "success" | "critical" | "warning" | "info";
}

function StatCard({ title, value, sub, loading, tone }: StatCardProps) {
  return (
    <Card>
      <BlockStack gap="200">
        <Text variant="bodySm" as="p" tone="subdued">
          {title}
        </Text>
        {loading ? (
          <SkeletonDisplayText size="medium" />
        ) : (
          <Text variant="heading2xl" as="p">
            {value}
          </Text>
        )}
        {sub && !loading && (
          <Text variant="bodySm" as="p" tone={tone ?? "subdued"}>
            {sub}
          </Text>
        )}
      </BlockStack>
    </Card>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [range, setRange] = useState<Range>("30d");
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMetrics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { fromDate, toDate } = getRangeDates(range);
      const data = await fetchMetrics(fromDate, toDate);
      setMetrics(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/admin/login");
      return;
    }
    loadMetrics();
  }, [loadMetrics, router]);

  function handleLogout() {
    clearToken();
    router.replace("/admin/login");
  }

  const rangeOptions = [
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
    { label: "Last 90 days", value: "90d" },
  ];

  // Top products table rows
  const productRows =
    metrics?.top_products.slice(0, 8).map((p) => [
      p.name,
      String(p.count),
      fmtDZD(p.revenue),
    ]) ?? [];

  // Status breakdown for pie
  const statusData =
    metrics?.orders_by_status.map((s) => ({
      name: s.status,
      value: s.count,
    })) ?? [];

  return (
    <Page
      title="Dashboard"
      subtitle="Shefaa Store Analytics"
      primaryAction={
        <Button onClick={loadMetrics} loading={loading}>
          Refresh
        </Button>
      }
      secondaryActions={[
        {
          content: "Orders",
          onAction: () => router.push("/admin/orders"),
        },
        {
          content: "Sign out",
          onAction: handleLogout,
          destructive: true,
        },
      ]}
    >
      <Layout>
        {error && (
          <Layout.Section>
            <Banner tone="critical" onDismiss={() => setError("")}>
              {error}
            </Banner>
          </Layout.Section>
        )}

        {/* Date range selector */}
        <Layout.Section>
          <InlineStack align="end">
            <div style={{ width: 200 }}>
              <Select
                label="Date range"
                labelHidden
                options={rangeOptions}
                value={range}
                onChange={(v) => setRange(v as Range)}
              />
            </div>
          </InlineStack>
        </Layout.Section>

        {/* KPI Cards */}
        <Layout.Section>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            <StatCard
              title="Total Orders"
              value={String(metrics?.total_orders ?? 0)}
              loading={loading}
            />
            <StatCard
              title="Total Revenue"
              value={metrics ? fmtDZD(metrics.total_revenue) : "—"}
              loading={loading}
              tone="success"
            />
            <StatCard
              title="Avg Order Value"
              value={metrics ? fmtDZD(metrics.avg_order_value) : "—"}
              loading={loading}
            />
            <StatCard
              title="Page Views (DZ)"
              value={String(metrics?.total_page_views ?? 0)}
              sub={`${metrics?.unique_sessions ?? 0} unique sessions`}
              loading={loading}
            />
            <StatCard
              title="Conversion Rate"
              value={metrics ? fmtPct(metrics.conversion_rate) : "—"}
              sub="orders / sessions"
              loading={loading}
              tone={
                (metrics?.conversion_rate ?? 0) >= 2 ? "success" : "warning"
              }
            />
          </div>
        </Layout.Section>

        {/* Orders over time + Revenue chart */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Orders & Revenue Over Time
              </Text>
              {loading ? (
                <SkeletonBodyText lines={8} />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart
                    data={metrics?.daily_series ?? []}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v: string) => v.slice(5)}
                    />
                    <YAxis yAxisId="orders" orientation="left" tick={{ fontSize: 11 }} />
                    <YAxis
                      yAxisId="revenue"
                      orientation="right"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <RechartsTooltip
                      formatter={(value: number, name: string) =>
                        name === "revenue" ? fmtDZD(value) : value
                      }
                    />
                    <Legend />
                    <Line
                      yAxisId="orders"
                      type="monotone"
                      dataKey="orders"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                      name="Orders"
                    />
                    <Line
                      yAxisId="revenue"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={false}
                      name="Revenue (DZD)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Page views chart */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Daily Page Views (Valid Algeria, non-VPN)
              </Text>
              {loading ? (
                <SkeletonBodyText lines={6} />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={metrics?.daily_series ?? []}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v: string) => v.slice(5)}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <RechartsTooltip />
                    <Bar dataKey="page_views" fill="#7c3aed" name="Page Views" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Top Products + Status Breakdown */}
        <Layout.Section>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {/* Top products */}
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Top Products
                </Text>
                {loading ? (
                  <SkeletonBodyText lines={6} />
                ) : (
                  <DataTable
                    columnContentTypes={["text", "numeric", "numeric"]}
                    headings={["Product", "Units", "Revenue"]}
                    rows={productRows}
                    truncate
                  />
                )}
              </BlockStack>
            </Card>

            {/* Order status breakdown */}
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Orders by Status
                </Text>
                {loading ? (
                  <SkeletonBodyText lines={6} />
                ) : (
                  <BlockStack gap="300">
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={STATUS_COLORS[entry.name] ?? PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <BlockStack gap="200">
                      {metrics?.orders_by_status.map((s, i) => (
                        <InlineStack key={s.status} align="space-between">
                          <InlineStack gap="200">
                            <div
                              style={{
                                width: 12,
                                height: 12,
                                borderRadius: 3,
                                background: STATUS_COLORS[s.status] ?? PIE_COLORS[i % PIE_COLORS.length],
                                marginTop: 3,
                              }}
                            />
                            <Text variant="bodySm" as="span">
                              {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                            </Text>
                          </InlineStack>
                          <Badge
                            tone={
                              s.status === "confirmed"
                                ? "success"
                                : s.status === "cancelled"
                                ? "critical"
                                : s.status === "new"
                                ? "info"
                                : "attention"
                            }
                          >
                            {String(s.count)}
                          </Badge>
                        </InlineStack>
                      ))}
                    </BlockStack>
                  </BlockStack>
                )}
              </BlockStack>
            </Card>
          </div>
        </Layout.Section>

        {/* UTM Sources */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Traffic Sources (UTM)
              </Text>
              {loading ? (
                <SkeletonBodyText lines={4} />
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                    gap: 12,
                  }}
                >
                  {metrics?.utm_sources.slice(0, 10).map((u) => (
                    <Card key={u.source}>
                      <BlockStack gap="100">
                        <Text variant="bodySm" as="p" tone="subdued">
                          {u.source}
                        </Text>
                        <Text variant="headingLg" as="p">
                          {u.count}
                        </Text>
                        <Text variant="bodySm" as="p" tone="subdued">
                          orders
                        </Text>
                      </BlockStack>
                    </Card>
                  ))}
                </div>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
