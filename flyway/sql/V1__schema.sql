CREATE TABLE products (
  id TEXT PRIMARY KEY
);

CREATE TABLE product_descriptions (
  product TEXT REFERENCES products(id),
  language CHAR(2),
  content TEXT NOT NULL,
  PRIMARY KEY (product, language)
);

CREATE TABLE product_names (
  product TEXT REFERENCES products(id),
  language CHAR(2),
  content TEXT NOT NULL,
  PRIMARY KEY (product, language)
);

CREATE TABLE categories (
  id TEXT PRIMARY KEY
);

CREATE TABLE category_names (
  category TEXT REFERENCES categories(id),
  language CHAR(2),
  content TEXT NOT NULL,
  PRIMARY KEY (category, language)
);

CREATE TABLE products_categories (
  product TEXT REFERENCES products(id),
  category TEXT REFERENCES categories(id),
  PRIMARY KEY (product, category)
);

CREATE TABLE variations (
  id SERIAL PRIMARY KEY,
  product TEXT NOT NULL REFERENCES products(id),
  data JSON NOT NULL
);

CREATE TABLE prices (
  variation SERIAL REFERENCES variations(id),
  currency CHAR(3),
  amount DECIMAL NOT NULL,
  PRIMARY KEY (variation, currency)
);
