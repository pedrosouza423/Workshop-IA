import { createFileRoute } from "@tanstack/react-router";
import { PreferencesForm } from "@features/settings/preferences-form";
import type { PreferencesFormData } from "@features/settings/schemas";
import { useAppStore } from "@core/app-store";

export const Route = createFileRoute("/_main/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  const handleSubmit = (data: PreferencesFormData) => {
    if (data.theme) {
      setTheme(data.theme);
      document.documentElement.setAttribute("data-theme", data.theme);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-app-foreground">Configurações</h1>
        <p className="text-app-muted mt-1">Preferências da aplicação.</p>
      </div>
      <div className="rounded-xl border border-app-border bg-app-surface p-6 shadow-sm">
        <PreferencesForm defaultValues={{ theme }} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
