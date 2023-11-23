import { CurrencyCodeRecord } from 'currency-codes';
import { LanguageCode } from 'iso-639-1';
import postgres from 'postgres';

import {
  Category, Product, Table, Variation,
} from './types.js';
import { parseNumber } from './util.js';

const sql = postgres({});

const insertProduct = async (id: string) => {
  await sql`
      INSERT INTO products(id)
      VALUES (${id})
      ON CONFLICT (id)
      DO NOTHING
  `;
};

const insertProductDescription = async (product: Product, language: LanguageCode) => {
  await sql`
      INSERT INTO product_descriptions(product, language, content)
      VALUES (${product.id}, ${language}, ${product.description})
      ON CONFLICT (product, language)
      DO NOTHING
  `;
};

const insertProductName = async (product: Product, language: LanguageCode) => {
  await sql`
      INSERT INTO product_names(product, language, content)
      VALUES (${product.id}, ${language}, ${product.name})
      ON CONFLICT (product, language)
      DO NOTHING
  `;
};

const insertCategory = async (id: string) => {
  await sql`
      INSERT INTO categories(id)
      VALUES (${id})
      ON CONFLICT (id)
      DO NOTHING
  `;
};

const insertCategoryNames = async (category: Category, language: LanguageCode) => {
  await sql`
      INSERT INTO category_names(category, language, content)
      VALUES (${category.id}, ${language}, ${category.name})
      ON CONFLICT (category, language)
      DO NOTHING
  `;
};

const insertProductsCategories = async (product: Product, category: Category) => {
  await sql`
      INSERT INTO products_categories(product, category)
      VALUES (${product.id}, ${category.id})
      ON CONFLICT (product, category)
      DO NOTHING
  `;
};

const insertVariation = async (product: Product, variation: Variation): Promise<number> => {
  const id = await sql`
      INSERT INTO variations(product, data)
      VALUES (${product.id}, ${JSON.stringify(variation.data)})
      RETURNING id
  `;
  return parseNumber(id[0].id);
};

const insertPrice = async (variationId: number, currency: CurrencyCodeRecord, amount: number) => {
  await sql`
      INSERT INTO prices(variation, currency, amount)
      VALUES (${variationId}, ${currency.code}, ${amount})
      ON CONFLICT (variation, currency)
      DO NOTHING
  `;
};

const getAll = async () => {
  const tableNames: string[] = [
    'products',
    'product_descriptions',
    'product_names',
    'categories',
    'category_names',
    'products_categories',
    'variations',
    'prices',
  ];
  const rows: Table[] = [];
  await Promise.all(tableNames.map(async (table) => {
    rows.push({
      table,
      data: await sql`SELECT * FROM ${sql(table)}`,
    });
  }));
  return rows;
};

export default {
  insertProduct,
  insertProductDescription,
  insertProductName,
  insertCategory,
  insertCategoryNames,
  insertProductsCategories,
  insertVariation,
  insertPrice,
  getAll,
};
