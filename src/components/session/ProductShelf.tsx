"use client";

import { formatBRL } from "@/lib/stores";
import type { Product } from "@/lib/types";

type ProductShelfProps = {
  products: Product[];
  onSelect?: (product: Product) => void;
};

export function ProductShelf({ products, onSelect }: ProductShelfProps) {
  if (!products.length) return null;

  return (
    <div className="product-shelf" aria-label="Produtos sugeridos">
      {products.map((product) => (
        <button
          key={product.id}
          type="button"
          className="product-card"
          onClick={() => onSelect?.(product)}
        >
          <div
            className="product-visual"
            style={{ background: product.imageGradient }}
            aria-hidden
          />
          <div className="product-body">
            <p className="product-category">{product.category}</p>
            <h3>{product.name}</h3>
            <p className="product-size">{product.size}</p>
            <p className="product-price">{formatBRL(product.price)}</p>
            <ul>
              {product.highlights.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </button>
      ))}
    </div>
  );
}
