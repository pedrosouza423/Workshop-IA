import { useForm } from "@tanstack/react-form";
import { FormFieldWrapper } from "@pattern/form";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { FormField, FormLabel, FormError, FormControl } from "@ui/form";
import { createFormSubmitHandler } from "@pattern/form.hooks";
import { productSchema } from "@features/products/schemas";
import type { ProductFormData } from "@features/products/schemas";

type ProductFormProps = {
  defaultValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void | Promise<void>;
  submitLabel?: string;
};

export function ProductForm({ defaultValues, onSubmit, submitLabel }: ProductFormProps) {
  const form = useForm<ProductFormData>({
    defaultValues: {
      id: defaultValues?.id,
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? 0,
      category: defaultValues?.category ?? "",
      status: defaultValues?.status ?? "active",
    },
    onSubmit: async () => {
      const handler = createFormSubmitHandler(productSchema, onSubmit);
      await handler(form);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <FormFieldWrapper form={form} name="name" label="Nome" />

      <form.Field name="description">
        {(field) => {
          const err = field.state.meta.errors?.[0];
          const error = typeof err === "string" ? err : undefined;
          return (
            <FormField>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <textarea
                  name={String(field.name)}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={!!error}
                  rows={3}
                  className="block w-full rounded-md border border-app-border bg-app-surface px-3 py-2 text-sm text-app-foreground focus:border-app-primary focus:outline-none focus:ring-1 focus:ring-app-primary"
                />
              </FormControl>
              {error ? <FormError>{error}</FormError> : null}
            </FormField>
          );
        }}
      </form.Field>

      <FormFieldWrapper form={form} name="category" label="Categoria" />

      <form.Field name="price">
        {(field) => {
          const err = field.state.meta.errors?.[0];
          const error = typeof err === "string" ? err : undefined;
          return (
            <FormField>
              <FormLabel>Preço (R$)</FormLabel>
              <FormControl>
                <Input
                  name={String(field.name)}
                  type="number"
                  step="0.01"
                  min="0"
                  value={Number.isFinite(field.state.value) ? String(field.state.value) : ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const next = e.target.value === "" ? 0 : Number(e.target.value);
                    field.handleChange(Number.isNaN(next) ? 0 : next);
                  }}
                  aria-invalid={!!error}
                />
              </FormControl>
              {error ? <FormError>{error}</FormError> : null}
            </FormField>
          );
        }}
      </form.Field>

      <form.Field name="status">
        {(field) => {
          const err = field.state.meta.errors?.[0];
          const error = typeof err === "string" ? err : undefined;
          return (
            <FormField>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select
                  name={String(field.name)}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value as ProductFormData["status"])}
                  aria-invalid={!!error}
                  className="block w-full rounded-md border border-app-border bg-app-surface px-3 py-2 text-sm text-app-foreground focus:border-app-primary focus:outline-none focus:ring-1 focus:ring-app-primary"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </FormControl>
              {error ? <FormError>{error}</FormError> : null}
            </FormField>
          );
        }}
      </form.Field>

      <div className="flex gap-2 pt-2">
        <Button type="submit" variant="primary">
          {submitLabel ?? "Salvar"}
        </Button>
      </div>
    </form>
  );
}
