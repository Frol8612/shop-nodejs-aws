insert into product (title, description, price)
values ('Aws PG Product-1', 'Aws PG Short Product Description-1', 2.4),
  ('Aws PG Product-2', 'Aws PG Short Product Description-2', 10),
  ('Aws PG Product-3', 'Aws PG Short Product Description-3', 23),
  ('Aws PG Product-4', 'Aws PG Short Product Description-4', 15),
  ('Aws PG Product-5', 'Aws PG Short Product Description-5', 23),
  ('Aws PG Product-6', 'Aws PG Short Product Description-6', 15),
  ('Aws PG Product-7', 'Aws PG Short Product Description-7', 23),
  ('Aws PG Product-8', 'Aws PG Short Product Description-8', 15)
on conflict (title) do update
set description = EXCLUDED.description,
	price = EXCLUDED.price;

insert into stock (product_id, count)
values ((select id from product where title = 'Aws PG Product-1'), 4),
	((select id from product where title = 'Aws PG Product-2'), 6),
  ((select id from product where title = 'Aws PG Product-3'), 7),
  ((select id from product where title = 'Aws PG Product-4'), 12),
  ((select id from product where title = 'Aws PG Product-5'), 7),
  ((select id from product where title = 'Aws PG Product-6'), 8),
  ((select id from product where title = 'Aws PG Product-7'), 2),
  ((select id from product where title = 'Aws PG Product-8'), 3)
on conflict (product_id) do update
set count = EXCLUDED.count;

-- with i as (
-- 	insert into product (title, description, price)
-- 	values ('Aws ProductOne', 'Aws Short Product Description1', 2.4)
-- 	on conflict (title) do update
-- 	set description = EXCLUDED.description,
-- 		price = EXCLUDED.price
-- 	returning id
-- )
-- insert into stock (product_id, count)
-- select id, 34
-- from i
-- on conflict (product_id) do update
-- set count = EXCLUDED.count;
