import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productDetailQueryOptions } from "@core/queries";
import { ProductForm } from "@features/products/form";
import type { ProductFormData } from "@features/products/schemas";
import { Loading } from "@ui/loading";

export const Route = createFileRoute("/_main/products/$productId")({
  component: ProductDetailPage,
  loader: async ({ context, params }) => {
    await context.queryClient.prefetchQuery(productDetailQueryOptions(params.productId));
  },
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery(productDetailQueryOptions(productId));

  const handleSubmit = async (next: ProductFormData) => {
    console.log("[products] atualizar:", next);
    await navigate({ to: "/products" });
  };

  if (isLoading) return <Loading />;
  if (error || !data) return <p className="text-red-600">Falha ao carregar o produto.</p>;

  return (
    <div className="space-y-4">
      <Link to="/products" className="text-sm text-app-primary hover:underline">
        ← Voltar aos produtos
      </Link>
      <div className="rounded-xl border border-app-border bg-app-surface p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-app-foreground mb-1">{data.name}</h1>
        <p className="text-app-muted mb-6">Editar dados do produto (ID: {data.id}).</p>
        <ProductForm
          defaultValues={data}
          onSubmit={handleSubmit}
          submitLabel="Atualizar"
        />
      </div>
    </div>
  );
}
