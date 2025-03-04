CREATE TYPE "public"."status" AS ENUM('draft', 'sent', 'paid', 'overdue', 'void');--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"createTs" timestamp DEFAULT now() NOT NULL,
	"amount" integer NOT NULL,
	"description" text NOT NULL,
	"status" "status" NOT NULL
);
