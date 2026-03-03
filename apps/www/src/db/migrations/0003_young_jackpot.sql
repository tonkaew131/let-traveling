ALTER TABLE "trip_messages" DROP CONSTRAINT "trip_messages_trip_id_trips_id_fk";
--> statement-breakpoint
ALTER TABLE "trip_messages" ADD CONSTRAINT "trip_messages_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;