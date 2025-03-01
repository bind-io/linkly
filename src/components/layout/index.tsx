import BrandingWhite from "../../assets/branding-white.png";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container mx-auto px-5 py-10">
      <div className="flex items-center justify-center">
        <img
          src={BrandingWhite}
          alt="Linkly"
          className="w-[170px]"
          draggable={false}
        />
      </div>

      {children}
    </main>
  );
}
