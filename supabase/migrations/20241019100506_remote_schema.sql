create policy "Give users authenticated access to folder 1rjzoq_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'plans'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder 1rjzoq_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'plans'::text) AND (auth.role() = 'authenticated'::text)));



