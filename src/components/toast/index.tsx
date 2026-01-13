import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: "hsl(var(--card))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "0.75rem",
          padding: "16px",
          fontSize: "14px",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        },
        success: {
          iconTheme: {
            primary: "hsl(var(--primary))",
            secondary: "hsl(var(--primary-foreground))",
          },
          style: {
            border: "1px solid hsl(var(--primary))",
          },
        },
        error: {
          iconTheme: {
            primary: "hsl(var(--destructive))",
            secondary: "hsl(var(--destructive-foreground))",
          },
          style: {
            border: "1px solid hsl(var(--destructive))",
          },
        },
      }}
    />
  );
}
