/*
  # Create products table for JASAMIN

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `nama` (text, product name)
      - `harga` (numeric, price)
      - `deskripsi` (text, product description)
      - `kategori` (text, product category)
      - `gambar` (text, image URL)
      - `badge_best_seller` (boolean, best seller flag)
      - `created_at` (timestamptz, creation timestamp)

  2. Security
    - Enable RLS on `products` table
    - Public can read products
    - Only authenticated admin can insert, update, delete products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  harga numeric NOT NULL DEFAULT 0,
  deskripsi text DEFAULT '',
  kategori text NOT NULL DEFAULT 'Lainnya',
  gambar text DEFAULT '',
  badge_best_seller boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);
