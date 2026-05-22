import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useProductsList, useUpdateProduct, useDeleteProduct } from "@features/products/hooks";
import { ProductForm } from "@features/products/form";
import type { ProductRecord } from "@core/queries";
import type { ProductFormData } from "@features/products/schemas";
import { Loading } from "@ui/loading";
import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import {
  DialogRoot,
  DialogPortal,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@ui/dialog";

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductsList() {
  const { data, isLoading, error } = useProductsList();
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductRecord | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct(editingProduct?.id ?? "");
  const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const handleUpdate = async (formData: ProductFormData) => {
    setUpdateError(null);
    try {
      await updateProduct(formData);
      setEditingProduct(null);
    } catch {
      setUpdateError("Falha ao atualizar o produto. Tente novamente.");
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setDeleteError(null);
    try {
      await deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    } catch {
      setDeleteError("Falha ao excluir o produto. Tente novamente.");
    }
  };

  const columns = useMemo<ColumnDef<ProductRecord>[]>(
    () => [
      {
        id: "name",
        header: "Nome",
        accessorKey: "name",
        cell: ({ row }) => (
          <span className="font-medium text-app-foreground">{row.original.name}</span>
        ),
      },
      {
        id: "category",
        header: "Categoria",
        accessorKey: "category",
        cell: ({ row }) => (
          <span className="text-app-muted">{row.original.category}</span>
        ),
      },
      {
        id: "price",
        header: "Preço",
        accessorKey: "price",
        cell: ({ row }) => (
          <span className="text-app-foreground tabular-nums">
            {priceFormatter.format(row.original.price)}
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) =>
          row.original.status === "active" ? (
            <Badge variant="default">Ativo</Badge>
          ) : (
            <Badge variant="outline">Inativo</Badge>
          ),
      },
      {
        id: "action",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditingProduct(row.original)}
              className="text-sm text-app-primary hover:underline"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => setDeletingProduct(row.original)}
              className="text-sm text-red-500 hover:underline"
            >
              Excluir
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-600">Falha ao carregar produtos.</p>;
  if (!data?.length) return <p className="text-app-muted py-4">Nenhum produto cadastrado.</p>;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-app-border">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-app-muted"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-app-border last:border-0">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DialogRoot
        open={!!editingProduct}
        onOpenChange={(open) => { if (!open && !isUpdating) setEditingProduct(null); }}
      >
        <DialogPortal>
          <DialogBackdrop />
          <DialogPanel>
            <div className="flex items-start justify-between mb-1">
              <DialogTitle>Editar produto</DialogTitle>
              <DialogClose className="text-app-muted hover:text-app-foreground text-lg leading-none -mt-1">
                ✕
              </DialogClose>
            </div>
            <DialogDescription className="mb-6">
              Atualize os dados do produto (ID: {editingProduct?.id}).
            </DialogDescription>
            {updateError && (
              <p className="mb-4 text-sm text-red-600">{updateError}</p>
            )}
            {editingProduct && (
              <ProductForm
                defaultValues={editingProduct}
                onSubmit={handleUpdate}
                submitLabel="Atualizar"
              />
            )}
          </DialogPanel>
        </DialogPortal>
      </DialogRoot>

      <DialogRoot
        open={!!deletingProduct}
        onOpenChange={(open) => { if (!open && !isDeleting) setDeletingProduct(null); }}
      >
        <DialogPortal>
          <DialogBackdrop />
          <DialogPanel className="max-w-sm">
            <div className="flex items-start justify-between mb-1">
              <DialogTitle>Excluir produto</DialogTitle>
              <DialogClose className="text-app-muted hover:text-app-foreground text-lg leading-none -mt-1">
                ✕
              </DialogClose>
            </div>
            <DialogDescription className="mb-6">
              Tem certeza que deseja excluir <strong>{deletingProduct?.name}</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
            {deleteError && (
              <p className="mb-4 text-sm text-red-600">{deleteError}</p>
            )}
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Excluindo…" : "Excluir"}
              </Button>
              <DialogClose render={<Button variant="outline" />}>
                Cancelar
              </DialogClose>
            </div>
          </DialogPanel>
        </DialogPortal>
      </DialogRoot>
    </>
  );
}
