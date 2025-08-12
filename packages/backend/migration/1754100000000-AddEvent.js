/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export class AddEvent1754100000000 {
	name = 'AddEvent1754100000000'

	async up(queryRunner) {
		// Create event table
		await queryRunner.query(`CREATE TABLE "event" ("noteId" character varying(32) NOT NULL, "start" TIMESTAMP WITH TIME ZONE NOT NULL, "end" TIMESTAMP WITH TIME ZONE, "title" character varying(128) NOT NULL, "metadata" jsonb NOT NULL DEFAULT '{"@context": "https://schema.org/", "@type": "Event"}', "noteVisibility" character varying NOT NULL, "userId" character varying(32) NOT NULL, "userHost" character varying(128), CONSTRAINT "PK_2b481f231cd035e84390072bf7b" PRIMARY KEY ("noteId"))`);
		
		// Add comments
		await queryRunner.query(`COMMENT ON COLUMN "event"."start" IS 'The start time of the event'`);
		await queryRunner.query(`COMMENT ON COLUMN "event"."end" IS 'The end of the event'`);
		await queryRunner.query(`COMMENT ON COLUMN "event"."title" IS 'short name of event'`);
		await queryRunner.query(`COMMENT ON COLUMN "event"."metadata" IS 'metadata object describing the event. Follows https://schema.org/Event'`);
		await queryRunner.query(`COMMENT ON COLUMN "event"."noteVisibility" IS '[Denormalized]'`);
		await queryRunner.query(`COMMENT ON COLUMN "event"."userId" IS '[Denormalized]'`);
		await queryRunner.query(`COMMENT ON COLUMN "event"."userHost" IS '[Denormalized]'`);
		
		// Create indexes
		await queryRunner.query(`CREATE INDEX "IDX_785ee5fc1ea38a1b9b38ff88e5" ON "event" ("start")`);
		await queryRunner.query(`CREATE INDEX "IDX_01cd2b829e0263917bf570cb67" ON "event" ("userId")`);
		await queryRunner.query(`CREATE INDEX "IDX_f6ba57dff679ccbcfe004698ec" ON "event" ("userHost")`);
		
		// Add foreign key constraint
		await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_2b481f231cd035e84390072bf7b" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		
		// Add hasEvent column to note table
		await queryRunner.query(`ALTER TABLE "note" ADD "hasEvent" boolean NOT NULL DEFAULT false`);
	}

	async down(queryRunner) {
		// Remove hasEvent column from note table
		await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "hasEvent"`);
		
		// Drop foreign key constraint
		await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_2b481f231cd035e84390072bf7b"`);
		
		// Drop indexes
		await queryRunner.query(`DROP INDEX "IDX_f6ba57dff679ccbcfe004698ec"`);
		await queryRunner.query(`DROP INDEX "IDX_01cd2b829e0263917bf570cb67"`);
		await queryRunner.query(`DROP INDEX "IDX_785ee5fc1ea38a1b9b38ff88e5"`);
		
		// Drop event table
		await queryRunner.query(`DROP TABLE "event"`);
	}
}