import { http, HttpResponse } from "msw";

const mockItems = [
  { id: "1", title: "Documentação do projeto" },
  { id: "2", title: "API de integração" },
  { id: "3", title: "Configuração de ambiente" },
  { id: "4", title: "Testes automatizados" },
  { id: "5", title: "Deploy em produção" },
];

const mockProducts = [
  {
    id: "1",
    name: "Camiseta básica",
    description: "Camiseta 100% algodão, corte regular.",
    price: 49.9,
    category: "Vestuário",
    status: "active" as const,
  },
  {
    id: "2",
    name: "Caneca cerâmica",
    description: "Caneca branca 300ml para estampa.",
    price: 19.9,
    category: "Acessórios",
    status: "active" as const,
  },
  {
    id: "3",
    name: "Mochila urbana",
    description: "Mochila resistente à água com compartimento para notebook.",
    price: 199.9,
    category: "Acessórios",
    status: "active" as const,
  },
  {
    id: "4",
    name: "Notebook Pro 14",
    description: "Notebook 14 polegadas, 16GB RAM, 512GB SSD.",
    price: 6499,
    category: "Eletrônicos",
    status: "inactive" as const,
  },
  {
    id: "5",
    name: "Fone bluetooth",
    description: "Fone over-ear com cancelamento de ruído.",
    price: 349.9,
    category: "Eletrônicos",
    status: "active" as const,
  },
];

export const handlers = [
  http.get("/api/items", () => {
    return HttpResponse.json(mockItems);
  }),
  http.get("/api/items/:id", ({ params }) => {
    const id = params["id"] as string;
    const item = mockItems.find((i) => i.id === id) ?? { id, title: `Item ${id}` };
    return HttpResponse.json(item);
  }),
  http.get("/api/products", () => {
    return HttpResponse.json(mockProducts);
  }),
  http.get("/api/products/:id", ({ params }) => {
    const id = params["id"] as string;
    const product = mockProducts.find((p) => p.id === id);
    if (!product) {
      return HttpResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return HttpResponse.json(product);
  }),
];
