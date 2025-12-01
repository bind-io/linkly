import BrandingWhite from "../../assets/branding-white.png";
import Branding from "../../assets/branding.png";
import { ThemeToggle } from "../theme-toggle";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative group">
            <img
              src={BrandingWhite}
              alt="Linkly"
              className="w-[180px] relative hidden dark:block"
              draggable={false}
            />
            <img
              src={Branding}
              alt="Linkly"
              className="w-[180px] relative block dark:hidden"
              draggable={false}
            />
          </div>
          <p className="mt-4 text-muted-foreground text-center max-w-md">
            UTM builder. Generate clean, tracked URLs in seconds.
          </p>
        </div>

        {children}
      </main>
    </div>
  );
}
