import axios, { AxiosResponse } from 'axios';
import { code } from 'currency-codes';

import queries from './queries.js';
import { Data, Product } from './types.js';
import {
  parseCurrency, parseData, parseLanguage, parseString,
} from './util.js';

const fetchProducts = async (): Promise<Product[]> => {
  console.log('Fetching products...');
  const url: string = parseString(process.env.API_URL);
  const response: AxiosResponse<any, any> = await axios.get(url);
  const data: Data = parseData(response.data);
  return data.products;
};

const saveProducts = async (products: Product[]): Promise<void> => {
  console.log('Saving products into a PostgreSQL database...');
  try {
    await Promise.all(products.map(async (product) => {
      await queries.insertProduct(product.id);
      await queries.insertProductDescription(product, parseLanguage('English'));
      await queries.insertProductName(product, parseLanguage('English'));
      await Promise.all(product.categories.map(async (category) => {
        await queries.insertCategory(category.id);
        await queries.insertCategoryNames(category, parseLanguage('English'));
        await queries.insertProductsCategories(product, category);
      }));
      await Promise.all(product.variations.map(async (variation) => {
        const id = await queries.insertVariation(product, variation);
        await queries.insertPrice(id, parseCurrency(code('EUR')), variation.price);
      }));
    }));
  } catch (error) {
    throw new Error(`Saving products failed: ${error}`);
  }
};

const main = async () => {
  const products: Product[] = await fetchProducts();
  await saveProducts(products);
  console.log('Printing data of all tables...');
  const rows = await queries.getAll();
  rows.forEach((row) => console.log(row));
};

await main();
process.exit(0);
