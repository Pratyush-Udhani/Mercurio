export type Product = {
  product_name: string;
  product_description: string;
  images: string[];
};

export type Workflow = {
  uuid: string;
  product: Product;
  llm_scripts: Record<string, string>[] | null;
};
