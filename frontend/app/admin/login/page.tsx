"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Page,
  Card,
  FormLayout,
  TextField,
  Button,
  Banner,
  BlockStack,
  Text,
  Box,
  InlineStack,
} from "@shopify/polaris";
import { adminLogin } from "../lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await adminLogin(username, password);
      router.replace("/admin/dashboard");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420, padding: "0 16px" }}>
        <Box paddingBlockEnd="500">
          <BlockStack gap="200" align="center">
            <Text variant="headingXl" as="h1" tone="magic">
              Shefaa Admin
            </Text>
            <Text variant="bodyMd" as="p" tone="subdued">
              Store management dashboard
            </Text>
          </BlockStack>
        </Box>

        <Card>
          <BlockStack gap="500">
            <Text variant="headingMd" as="h2">
              Sign in
            </Text>

            {error && (
              <Banner tone="critical" onDismiss={() => setError("")}>
                {error}
              </Banner>
            )}

            <FormLayout>
              <TextField
                label="Username"
                value={username}
                onChange={setUsername}
                autoComplete="username"
                disabled={loading}
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
                disabled={loading}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter") handleLogin();
                }}
              />
            </FormLayout>

            <Button
              variant="primary"
              fullWidth
              onClick={handleLogin}
              loading={loading}
              size="large"
            >
              Sign in
            </Button>
          </BlockStack>
        </Card>
      </div>
    </div>
  );
}
