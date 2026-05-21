import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useProductsList } from "@features/products/hooks";
import type { ProductRecord } from "@core/queries";
import { Loading } from "@ui/loading";
import { Badge } from "@ui/badge";

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductsList() {
  const { data, isLoading, error } = useProductsList();

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
          <Link
            to="/products/$productId"
            params={{ productId: row.original.id }}
            className="text-sm text-app-primary hover:underline"
          >
            Editar
          </Link>
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
  );
}
