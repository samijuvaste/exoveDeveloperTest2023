import { CurrencyCodeRecord } from 'currency-codes';
import ISO6391, { LanguageCode } from 'iso-639-1';

import {
  Category, Data, Product, Variation,
} from './types.js';

const errorMessage = (object: string): string => (
  `Incorrect or missing data in ${object} object`
);

const isString = (object: unknown): object is string => (
  typeof object === 'string' || object instanceof String
);

const isNumber = (object: unknown): object is number => (
  typeof object === 'number' || object instanceof String
);

export const parseString = (object: unknown): string => {
  if (!object || !isString(object)) {
    throw new Error(errorMessage('string'));
  }
  return object;
};

export const parseNumber = (object: unknown): number => {
  if (!object || !isNumber(object)) {
    throw new Error(errorMessage('number'));
  }
  return object;
};

const parseCategories = (array: unknown): Category[] => {
  if (!Array.isArray(array)) {
    throw new Error(errorMessage('category array'));
  }
  const unknownArray = array as unknown[];
  const categories: Category[] = [];
  unknownArray.forEach((object) => {
    if (!object || typeof object !== 'object') {
      throw new Error(errorMessage('category'));
    } else if ('id' in object && 'name' in object) {
      const category: Category = {
        id: parseString(object.id),
        name: parseString(object.name),
      };
      categories.push(category);
    } else {
      throw new Error(errorMessage('category'));
    }
  });
  return categories;
};

const parseVariations = (array: unknown): Variation[] => {
  if (!Array.isArray(array)) {
    throw new Error(errorMessage('variation array'));
  }
  const unknownArray = array as unknown[];
  const variations: Variation[] = [];
  unknownArray.forEach((object) => {
    if (!object || typeof object !== 'object') {
      throw new Error(errorMessage('variation'));
    } else if ('price' in object) {
      const { price, ...data } = object;
      const variation: Variation = {
        price: parseNumber(price),
        data,
      };
      variations.push(variation);
    } else {
      throw new Error(errorMessage('variation'));
    }
  });
  return variations;
};

const parseProducts = (array: unknown): Product[] => {
  if (!Array.isArray(array)) {
    throw new Error(errorMessage('product array'));
  }
  const unknownArray = array as unknown[];
  const products: Product[] = [];
  unknownArray.forEach((object) => {
    if (!object || typeof object !== 'object') {
      throw new Error(errorMessage('product'));
    } else if ('id' in object && 'name' in object && 'description' in object && 'categories' in object && 'variations' in object) {
      const product: Product = {
        id: parseString(object.id),
        name: parseString(object.name),
        description: parseString(object.description),
        categories: parseCategories(object.categories),
        variations: parseVariations(object.variations),
      };
      products.push(product);
    } else {
      throw new Error(errorMessage('product'));
    }
  });
  return products;
};

export const parseData = (object: unknown): Data => {
  if (!object || typeof object !== 'object') {
    throw new Error(errorMessage('data'));
  }
  if ('products' in object && 'results' in object) {
    const data: Data = {
      products: parseProducts(object.products),
      results: parseNumber(object.results),
    };
    if (data.results === data.products.length) {
      return data;
    }
  }
  throw new Error(errorMessage('data'));
};

export const parseLanguage = (language: string): LanguageCode => {
  const code = ISO6391.getCode(language);
  if (code) {
    return code;
  }
  throw new Error(errorMessage('language'));
};

export const parseCurrency = (currency: CurrencyCodeRecord | undefined): CurrencyCodeRecord => {
  if (!currency) {
    throw new Error(errorMessage('currency'));
  }
  return currency;
};
