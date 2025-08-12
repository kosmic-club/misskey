/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Inject, Injectable } from '@nestjs/common';
import type Logger from '@/logger.js';
import { bindThis } from '@/decorators.js';
import type { IEvent } from '@/models/Event.js';
import { ApLoggerService } from '../ApLoggerService.js';
import { ApResolverService } from '../ApResolverService.js';
import type { Resolver } from '../ApResolverService.js';
import type { IObject } from '../type.js';

@Injectable()
export class ApEventService {
	private logger: Logger;

	constructor(
		private apResolverService: ApResolverService,
		private apLoggerService: ApLoggerService,
	) {
		this.logger = this.apLoggerService.logger;
	}

	@bindThis
	public async extractEventFromNote(source: string | IObject, resolverParam?: Resolver): Promise<IEvent> {
		const resolver = resolverParam ?? this.apResolverService.createResolver();

		const note = await resolver.resolve(source);

		if (!this.isEvent(note)) {
			throw new Error('invalid type');
		}

		if (note.name && note.startTime) {
			const title = note.name;
			const start = new Date(note.startTime);
			const end = note.endTime ? new Date(note.endTime) : null;

			return {
				title,
				start,
				end,
				metadata: {
					'@type': 'Event',
					name: note.name,
					url: note.url,
					startDate: start.toISOString(),
					endDate: end?.toISOString(),
					description: note.summary,
					identifier: note.id,
					location: note.location,
					organizer: note.organizer,
					performer: note.performer,
					audience: note.audience,
					inLanguage: note.inLanguage,
					typicalAgeRange: note.typicalAgeRange,
					keywords: note.keywords,
					isAccessibleForFree: note.isAccessibleForFree,
					offers: note.offers,
				},
			};
		} else {
			throw new Error('Invalid event properties');
		}
	}

	@bindThis
	private isEvent(object: IObject): boolean {
		return object.type === 'Event' || (object.type === 'Note' && object.name != null && object.startTime != null);
	}
}