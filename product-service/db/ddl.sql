create extension if not exists "uuid-ossp";

create table if not exists product (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text default '',
	price numeric default 0
);

alter table product add constraint product_title unique (title);

create table if not exists stock (
  product_id uuid,
  count integer default 0,
  foreign key (product_id) references product (id)
);

alter table stock add constraint stock_product_id unique (product_id);

--drop table stock;
--drop table product;
