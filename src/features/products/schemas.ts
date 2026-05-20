import * as v from "valibot";

export const productSchema = v.object({
  id: v.optional(v.string()),
  name: v.pipe(v.string(), v.minLength(1, "Nome é obrigatório")),
  description: v.pipe(v.string(), v.minLength(1, "Descrição é obrigatória")),
  price: v.pipe(v.number("Preço deve ser um número"), v.minValue(0, "Preço não pode ser negativo")),
  category: v.pipe(v.string(), v.minLength(1, "Categoria é obrigatória")),
  status: v.picklist(["active", "inactive"], "Status inválido"),
});

export type ProductFormData = v.InferOutput<typeof productSchema>;
