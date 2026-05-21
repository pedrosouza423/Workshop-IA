import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCreateProduct } from "@features/products/hooks";
import { ProductForm } from "@features/products/form";
import type { ProductFormData } from "@features/products/schemas";

export const Route = createFileRoute("/_main/products/new")({
  component: ProductNewPage,
});

function ProductNewPage() {
  const navigate = useNavigate();
  const { mutateAsync: createProduct } = useCreateProduct();

  const handleSubmit = async (data: ProductFormData) => {
    await createProduct(data);
    await navigate({ to: "/products" });
  };

  return (
    <div className="space-y-4">
      <Link to="/products" className="text-sm text-app-primary hover:underline">
        ← Voltar aos produtos
      </Link>
      <div className="rounded-xl border border-app-border bg-app-surface p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-app-foreground mb-1">Novo produto</h1>
        <p className="text-app-muted mb-6">Preencha os dados do novo produto.</p>
        <ProductForm onSubmit={handleSubmit} submitLabel="Criar produto" />
      </div>
    </div>
  );
}
