create table if not exists product (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  price integer
);

create table if not exists stock (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid,
  count integer,
  foreign key ("product_id") references "product" ("id")
  CONSTRAINT Product_Id UNIQUE (product_id)
);
