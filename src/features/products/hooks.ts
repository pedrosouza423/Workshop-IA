import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsQueryOptions, productDetailQueryOptions } from "@core/queries";
import { httpResource } from "@core/http-resource";
import { queryKeys } from "@core/keys";
import type { ProductRecord } from "@core/queries";
import type { ProductFormData } from "./schemas";

export function useProductsList() {
  return useQuery(productsQueryOptions);
}

export function useProduct(id: string) {
  return useQuery(productDetailQueryOptions(id));
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const create = httpResource<ProductRecord>("POST", "/products");
  return useMutation({
    mutationFn: (data: ProductFormData) => create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.list().queryKey });
    },
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();
  const update = httpResource<ProductRecord>("PATCH", `/products/${id}`);
  return useMutation({
    mutationFn: (data: ProductFormData) => update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.list().queryKey });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id).queryKey });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/products/${id}`, { method: "DELETE" }).then((res) => {
        if (!res.ok) throw new Error("Failed to delete product");
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.list().queryKey });
    },
  });
}
