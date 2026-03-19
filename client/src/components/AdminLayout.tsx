import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation, useRouter } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import GrainOverlay from "./GrainOverlay";
import CustomCursor from "./CustomCursor";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [location] = useLocation();
  const router = useRouter();
  const logoutMutation = trpc.auth.logout.useMutation();

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-base flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-text-main" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-sand-base flex flex-col items-center justify-center">
        <GrainOverlay />
        <CustomCursor />
        <h1 className="text-4xl font-bold text-text-main mb-4">
          {t("admin.unauthorized")}
        </h1>
        <p className="text-text-main opacity-70 mb-8">{t("admin.login")}</p>
        <Button
          onClick={() => {
            window.location.href = getLoginUrl();
          }}
          className="bg-accent-lava text-sand-base hover:bg-accent-lava/90"
        >
          {t("admin.login")}
        </Button>
      </div>
    );
  }

  const adminMenuItems = [
    { label: t("admin.blog"), href: "/admin/blog" },
    { label: t("admin.portfolio"), href: "/admin/portfolio" },
  ];

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-sand-base">
      <GrainOverlay />
      <CustomCursor />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-sand-light border-r border-text-main/10 p-8 fixed left-0 top-0 h-screen overflow-y-auto">
          <div className="mb-12">
            <h1 className="text-lg font-bold tracking-widest font-mono text-text-main">
              ADMIN
            </h1>
            <p className="text-xs text-text-main/60 mt-2">{user?.name}</p>
          </div>

          <nav className="space-y-2 mb-12">
            {adminMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded text-sm font-mono tracking-wide transition ${
                  location === item.href
                    ? "bg-accent-lava text-sand-base"
                    : "text-text-main hover:bg-sand-base"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full"
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t("admin.logout")
            )}
          </Button>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-12">
          {title && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-text-main">{title}</h2>
              <div className="h-1 w-12 bg-accent-lava mt-2"></div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
