DROP INDEX "idx_conversation_messages";--> statement-breakpoint
CREATE INDEX "idx_conversation_participants_conversation_id" ON "conversation_participants" USING btree ("conversation_id");