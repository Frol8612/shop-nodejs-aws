insert into product (title, description, price)
values ('Aws ProductOne', 'Aws Short Product Description1', 2.4),
  ('Aws ProductNew', 'Aws Short Product Description3', 10),
  ('Aws ProductTop', 'Aws Short Product Description2', 23),
  ('ProductTitle', 'Aws Short Product Description7', 15),
  ('Aws Product', 'Aws Short Product Description2', 23),
  ('Aws ProductTest', 'Aws Short Product Description4', 15),
  ('Aws Product2', 'Aws Short Product Descriptio1', 23),
  ('Aws ProductName', 'Aws Short Product Description7', 15)
on conflict (title) do update
set description = EXCLUDED.description,
	price = EXCLUDED.price;

insert into stock (product_id, count)
values ((select id from product where title = 'Aws ProductOne'), 4),
	((select id from product where title = 'Aws ProductNew'), 6),
  ((select id from product where title = 'Aws ProductTop'), 7),
  ((select id from product where title = 'ProductTitle'), 12),
  ((select id from product where title = 'Aws Product'), 7),
  ((select id from product where title = 'Aws ProductTest'), 8),
  ((select id from product where title = 'Aws Product2'), 2),
  ((select id from product where title = 'Aws ProductName'), 3)
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
