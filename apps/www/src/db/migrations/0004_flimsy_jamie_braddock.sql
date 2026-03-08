ALTER TABLE "trip_messages" ALTER COLUMN "content" TYPE jsonb USING to_jsonb("content");
