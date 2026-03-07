import "./globals.css";
import ThemeHandler from "@/src/components/ThemeHandler";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <ThemeHandler />
        {children}
      </body>
    </html>
  );
}