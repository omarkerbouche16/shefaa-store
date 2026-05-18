"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Page,
  Layout,
  Card,
  IndexTable,
  Badge,
  Button,
  TextField,
  Select,
  InlineStack,
  Text,
  BlockStack,
  Pagination,
  Banner,
  Spinner,
  Box,
  Modal,
  Divider,
  DescriptionList,
  Thumbnail,
  EmptyState,
} from "@shopify/polaris";
import { fetchOrders, fetchOrder, updateOrderStatus, isLoggedIn, clearToken } from "../lib/api";
import type { AdminOrderItem, AdminOrderDetail, CartItem } from "../lib/types";

const STATUSES = [
  { label: "All statuses", value: "" },
  { label: "New", value: "new" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Returned", value: "returned" },
];

function statusTone(
  s: string
): "success" | "critical" | "info" | "attention" | "warning" {
  if (s === "confirmed" || s === "delivered") return "success";
  if (s === "cancelled" || s === "returned") return "critical";
  if (s === "new") return "info";
  return "attention";
}

function fmtDZD(n: number | null) {
  if (n == null) return "—";
  return `${n.toLocaleString("en-DZ")} DZD`;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Order Detail Modal ────────────────────────────────────────────────────────

interface OrderDetailProps {
  orderId: string | null;
  onClose: () => void;
  onStatusChange: () => void;
}

function OrderDetailModal({ orderId, onClose, onStatusChange }: OrderDetailProps) {
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    fetchOrder(orderId)
      .then((o) => {
        setOrder(o);
        setNewStatus(o.status);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  async function handleStatusChange() {
    if (!order || newStatus === order.status) return;
    setStatusUpdating(true);
    try {
      await updateOrderStatus(order.order_id, newStatus);
      setOrder({ ...order, status: newStatus });
      onStatusChange();
    } finally {
      setStatusUpdating(false);
    }
  }

  const items: CartItem[] = (order?.items_json as CartItem[]) ?? [];

  return (
    <Modal
      open={!!orderId}
      onClose={onClose}
      title={order ? `Order ${order.friendly_id}` : "Loading order…"}
      large
      primaryAction={{
        content: "Update status",
        onAction: handleStatusChange,
        loading: statusUpdating,
        disabled: !order || newStatus === order?.status,
      }}
      secondaryActions={[{ content: "Close", onAction: onClose }]}
    >
      <Modal.Section>
        {loading && (
          <InlineStack align="center">
            <Spinner size="large" />
          </InlineStack>
        )}
        {!loading && order && (
          <BlockStack gap="500">
            {/* Status + Update */}
            <InlineStack gap="400" align="start" blockAlign="end">
              <Badge tone={statusTone(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <div style={{ width: 200 }}>
                <Select
                  label="Change status"
                  options={STATUSES.filter((s) => s.value !== "")}
                  value={newStatus}
                  onChange={setNewStatus}
                />
              </div>
            </InlineStack>

            <Divider />

            {/* Customer info */}
            <Text variant="headingMd" as="h3">Customer</Text>
            <DescriptionList
              items={[
                { term: "Name", description: order.customer_name },
                { term: "Phone (local)", description: order.phone_local ?? "—" },
                { term: "Phone (E.164)", description: order.phone_e164 ?? "—" },
                { term: "IP Address", description: order.ip_address ?? "—" },
                { term: "Order date", description: fmtDate(order.created_at) },
              ]}
            />

            <Divider />

            {/* Items */}
            <Text variant="headingMd" as="h3">Items</Text>
            <BlockStack gap="300">
              {items.map((item, i) => (
                <Card key={i}>
                  <InlineStack gap="400" blockAlign="start">
                    {item.image && (
                      <Thumbnail
                        source={item.image}
                        alt={item.name}
                        size="medium"
                      />
                    )}
                    <BlockStack gap="100">
                      <Text variant="headingSm" as="p">{item.name}</Text>
                      <Text variant="bodySm" as="p" tone="subdued">
                        {item.offer?.label} — {item.offer?.pieces} pieces
                      </Text>
                      <InlineStack gap="400">
                        <Text variant="bodySm" as="p">Qty: <strong>{item.quantity}</strong></Text>
                        <Text variant="bodySm" as="p">
                          Price: <strong>{fmtDZD(item.offer?.priceDa)}</strong>
                        </Text>
                        <Text variant="bodySm" as="p">
                          Total: <strong>{fmtDZD((item.offer?.priceDa ?? 0) * item.quantity)}</strong>
                        </Text>
                      </InlineStack>
                    </BlockStack>
                  </InlineStack>
                </Card>
              ))}

              {order.upsell_json && (order.upsell_json as { accepted?: boolean }).accepted && (
                <Card>
                  <InlineStack align="space-between">
                    <Text variant="bodySm" as="p">
                      ✨ Upsell accepted
                    </Text>
                    <Text variant="bodySm" as="p">
                      {fmtDZD((order.upsell_json as { priceDa?: number }).priceDa ?? 0)}
                    </Text>
                  </InlineStack>
                </Card>
              )}
            </BlockStack>

            {/* Totals */}
            <Card>
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text variant="bodySm" as="p" tone="subdued">Subtotal</Text>
                  <Text variant="bodySm" as="p">{fmtDZD(order.subtotal_da)}</Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text variant="bodySm" as="p" tone="subdued">Shipping</Text>
                  <Text variant="bodySm" as="p">{fmtDZD(order.shipping_da)}</Text>
                </InlineStack>
                <Divider />
                <InlineStack align="space-between">
                  <Text variant="headingSm" as="p">Total</Text>
                  <Text variant="headingSm" as="p">{fmtDZD(order.total_da)}</Text>
                </InlineStack>
              </BlockStack>
            </Card>

            <Divider />

            {/* Attribution */}
            <Text variant="headingMd" as="h3">Attribution & Technical</Text>
            <DescriptionList
              items={[
                {
                  term: "UTM Source",
                  description: order.utm_json?.utm_source ?? "direct",
                },
                {
                  term: "UTM Medium",
                  description: order.utm_json?.utm_medium ?? "—",
                },
                {
                  term: "UTM Campaign",
                  description: order.utm_json?.utm_campaign ?? "—",
                },
                {
                  term: "Landing Page",
                  description: order.landing_page ?? "—",
                },
                { term: "Referrer", description: order.referrer ?? "—" },
                {
                  term: "Sheet synced",
                  description: order.sheet_synced_at
                    ? fmtDate(order.sheet_synced_at)
                    : "Not yet",
                },
                {
                  term: "Pixel synced",
                  description: order.tracking_synced_at
                    ? fmtDate(order.tracking_synced_at)
                    : "Not yet",
                },
              ]}
            />

            {order.user_agent && (
              <Box padding="200" background="bg-surface-secondary" borderRadius="200">
                <Text variant="bodySm" as="p" tone="subdued" breakWord>
                  {order.user_agent}
                </Text>
              </Box>
            )}
          </BlockStack>
        )}
      </Modal.Section>
    </Modal>
  );
}

// ── Orders Page ───────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchOrders({
        page,
        limit: 20,
        status: statusFilter,
        search,
      });
      setOrders(res.items);
      setTotal(res.total);
      setPages(res.pages);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/admin/login");
      return;
    }
    load();
  }, [load, router]);

  function handleLogout() {
    clearToken();
    router.replace("/admin/login");
  }

  const resourceName = { singular: "order", plural: "orders" };

  const rowMarkup = orders.map((o, index) => (
    <IndexTable.Row
      id={o.order_id}
      key={o.order_id}
      position={index}
      onClick={() => setSelectedOrderId(o.order_id)}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="semibold" as="span">
          {o.friendly_id}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{fmtDate(o.created_at)}</IndexTable.Cell>
      <IndexTable.Cell>{o.customer_name}</IndexTable.Cell>
      <IndexTable.Cell>{o.phone_local ?? "—"}</IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone={statusTone(o.status)}>
          {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
        </Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>{o.items_count} item{o.items_count !== 1 ? "s" : ""}</IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          {fmtDZD(o.total_da)}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge>{o.utm_source ?? "direct"}</Badge>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page
      title="Orders"
      subtitle={`${total} total orders`}
      backAction={{ content: "Dashboard", url: "/admin/dashboard" }}
      secondaryActions={[
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

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              {/* Filters */}
              <InlineStack gap="300" wrap>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <TextField
                    label="Search"
                    labelHidden
                    placeholder="Search name or phone…"
                    value={search}
                    onChange={(v) => {
                      setSearch(v);
                      setPage(1);
                    }}
                    autoComplete="off"
                    clearButton
                    onClearButtonClick={() => setSearch("")}
                  />
                </div>
                <div style={{ width: 180 }}>
                  <Select
                    label="Status"
                    labelHidden
                    options={STATUSES}
                    value={statusFilter}
                    onChange={(v) => {
                      setStatusFilter(v);
                      setPage(1);
                    }}
                  />
                </div>
                <Button onClick={load} loading={loading}>
                  Search
                </Button>
              </InlineStack>

              {/* Table */}
              {loading ? (
                <InlineStack align="center">
                  <Spinner />
                </InlineStack>
              ) : orders.length === 0 ? (
                <EmptyState
                  heading="No orders found"
                  image=""
                >
                  <p>Try adjusting your filters.</p>
                </EmptyState>
              ) : (
                <IndexTable
                  resourceName={resourceName}
                  itemCount={orders.length}
                  headings={[
                    { title: "Order ID" },
                    { title: "Date" },
                    { title: "Customer" },
                    { title: "Phone" },
                    { title: "Status" },
                    { title: "Items" },
                    { title: "Total" },
                    { title: "Source" },
                  ]}
                  selectable={false}
                >
                  {rowMarkup}
                </IndexTable>
              )}

              {/* Pagination */}
              {pages > 1 && (
                <InlineStack align="center">
                  <Pagination
                    hasPrevious={page > 1}
                    onPrevious={() => setPage((p) => p - 1)}
                    hasNext={page < pages}
                    onNext={() => setPage((p) => p + 1)}
                    label={`Page ${page} of ${pages}`}
                  />
                </InlineStack>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>

      {/* Order detail modal */}
      <OrderDetailModal
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        onStatusChange={load}
      />
    </Page>
  );
}
