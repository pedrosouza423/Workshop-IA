import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductsList } from "@features/products/list";

export const Route = createFileRoute("/_main/products/")({
  component: ProductsListPage,
});

function ProductsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-app-foreground">Produtos</h1>
          <p className="text-app-muted mt-1">Catálogo de produtos da aplicação.</p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center rounded-md bg-app-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-app-primary-hover"
        >
          Novo produto
        </Link>
      </div>
      <div className="rounded-xl border border-app-border bg-app-surface p-6 shadow-sm">
        <ProductsList />
      </div>
    </div>
  );
}
