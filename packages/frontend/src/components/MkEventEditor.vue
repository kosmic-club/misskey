<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div class="container">
	<MkInput v-model="title" small type="text" class="input">
		<template #label>*{{ i18n.ts.title }}</template>
	</MkInput>
	<section>
		<div class="row">
			<section>
				<MkInput v-model="startDate" small type="date" class="input">
					<template #label>*{{ i18n.ts._event.startDate }}</template>
				</MkInput>
			</section>
			<section>
				<MkInput v-model="startTime" small type="time" class="input">
					<template #label>*{{ i18n.ts._event.startTime }}</template>
				</MkInput>
			</section>
			<section>
				<MkInput v-model="endDate" small type="date" class="input">
					<template #label>{{ i18n.ts._event.endDate }}</template>
				</MkInput>
			</section>
			<section>
				<MkInput v-model="endTime" small type="time" class="input">
					<template #label>{{ i18n.ts._event.endTime }}</template>
				</MkInput>
			</section>
		</div>
		<div class="row">
			<section>
				<MkInput v-model="location" small type="text" class="input">
					<template #label>{{ i18n.ts._event.location }}</template>
				</MkInput>
			</section>
			<section>
				<MkInput v-model="url" small type="url" class="input">
					<template #label>URL</template>
				</MkInput>
			</section>
		</div>
		<div class="row">
			<section>
				<MkSwitch v-model="showAdvanced" :disabled="false" class="input">{{ i18n.ts.advanced }}</MkSwitch>
			</section>
		</div>
		<div v-show="showAdvanced" class="advanced">
			<div class="row">
				<section>
					<MkInput v-model="doorTime" small type="time" class="input">
						<template #label>{{ i18n.ts._event.doorTime }}</template>
					</MkInput>
				</section>
				<section>
					<MkInput v-model="organizer" small type="text" class="input">
						<template #label>{{ i18n.ts._event.organizer }}</template>
					</MkInput>
				</section>
			</div>
			<div class="row">
				<section>
					<MkInput v-model="organizerLink" small type="url" class="input">
						<template #label>{{ i18n.ts._event.organizerLink }}</template>
					</MkInput>
				</section>
				<section>
					<MkInput v-model="audience" small type="text" class="input">
						<template #label>{{ i18n.ts._event.audience }}</template>
					</MkInput>
				</section>
			</div>
			<div class="row">
				<section>
					<MkInput v-model="language" small type="text" class="input">
						<template #label>{{ i18n.ts._event.language }}</template>
					</MkInput>
				</section>
				<section>
					<MkInput v-model="ageRange" small type="text" class="input">
						<template #label>{{ i18n.ts._event.ageRange }}</template>
					</MkInput>
				</section>
			</div>
			<div class="row">
				<section>
					<MkInput v-model="ticketsUrl" small type="url" class="input">
						<template #label>{{ i18n.ts._event.ticketsUrl }}</template>
					</MkInput>
				</section>
				<section>
					<MkSwitch v-model="isFree" :disabled="false">
						{{ i18n.ts._event.isFree }}
					</MkSwitch>
				</section>
			</div>
			<div class="row">
				<section>
					<MkInput v-model="price" small type="text" class="input">
						<template #label>{{ i18n.ts._event.price }}</template>
					</MkInput>
				</section>
				<section>
					<MkInput v-model="keywords" small type="text" class="input">
						<template #label>{{ i18n.ts._event.keywords }}</template>
					</MkInput>
				</section>
			</div>
			<div class="row">
				<section>
					<MkInput v-model="availabilityStart" small type="datetime-local" class="input">
						<template #label>{{ i18n.ts._event.availabilityStart }}</template>
					</MkInput>
				</section>
				<section>
					<MkInput v-model="availabilityEnd" small type="datetime-local" class="input">
						<template #label>{{ i18n.ts._event.availabilityEnd }}</template>
					</MkInput>
				</section>
			</div>
		</div>
	</section>
</div>
</template>

<script lang="ts" setup>
import * as Misskey from 'misskey-js';
import { Ref, ref, watch } from 'vue';
import MkInput from './MkInput.vue';
import MkSwitch from './MkSwitch.vue';
import { addTime } from '@/utility/time.js';
import { i18n } from '@/i18n.js';

const props = defineProps<{
	modelValue: Misskey.entities.Note['event']
}>();

const emit = defineEmits<{
	(ev: 'update:modelValue', v: Misskey.entities.Note['event']): void
}>();

// Get tomorrow as default start date
const tomorrow = addTime(new Date(), 1, 'day');
const formatDate = (date: Date): string => {
	return date.getFullYear() + '-' + 
		String(date.getMonth() + 1).padStart(2, '0') + '-' + 
		String(date.getDate()).padStart(2, '0');
};

const title = ref(props.modelValue?.title ?? '');
const startDate = ref(formatDate(tomorrow));
const startTime = ref('00:00');
const endDate = ref('');
const endTime = ref('');
const location = ref(props.modelValue?.metadata.location ?? '');
const url = ref(props.modelValue?.metadata.url ?? '');
const showAdvanced = ref(false);
const doorTime = ref(props.modelValue?.metadata.doorTime ?? '');
const organizer = ref(props.modelValue?.metadata.organizer?.name ?? '');
const organizerLink = ref(props.modelValue?.metadata.organizer?.sameAs ?? '');
const audience = ref(props.modelValue?.metadata.audience?.name ?? '');
const language = ref(props.modelValue?.metadata.inLanguage ?? '');
const ageRange = ref(props.modelValue?.metadata.typicalAgeRange ?? '');
const ticketsUrl = ref(props.modelValue?.metadata.offers?.url ?? '');
const isFree = ref(props.modelValue?.metadata.isAccessibleForFree ?? false);
const price = ref(props.modelValue?.metadata.offers?.price ?? '');
const availabilityStart = ref(props.modelValue?.metadata.offers?.availabilityStarts ?? '');
const availabilityEnd = ref(props.modelValue?.metadata.offers?.availabilityEnds ?? '');
const keywords = ref(props.modelValue?.metadata.keywords ?? '');

function get(): Misskey.entities.Note['event'] {
	const calcAt = (date: Ref<string>, time: Ref<string>): number => (new Date(`${date.value} ${time.value}`)).getTime();

	const start = calcAt(startDate, startTime);
	const end = endDate.value ? calcAt(endDate, endTime) : null;
	return {
		title: title.value,
		start: start,
		end: end,
		metadata: {
			'@type': 'Event',
			name: title.value,
			startDate: (new Date(start)).toISOString(),
			endDate: end ? (new Date(end)).toISOString() : undefined,
			location: location.value || undefined,
			url: url.value || undefined,
			doorTime: doorTime.value || undefined,
			organizer: organizer.value ? {
				'@type': 'Thing',
				name: organizer.value,
				sameAs: organizerLink.value || undefined,
			} : undefined,
			audience: audience.value ? {
				'@type': 'Audience',
				name: audience.value,
			} : undefined,
			inLanguage: language.value || undefined,
			typicalAgeRange: ageRange.value || undefined,
			isAccessibleForFree: isFree.value,
			offers: ticketsUrl.value || price.value ? {
				'@type': 'Offer',
				price: price.value || undefined,
				priceCurrency: undefined,
				availabilityStarts: availabilityStart.value || undefined,
				availabilityEnds: availabilityEnd.value || undefined,
				url: ticketsUrl.value || undefined,
			} : undefined,
			keywords: keywords.value || undefined,
		},
	};
}

watch([title, startDate, startTime, endDate, endTime, location, url, doorTime, organizer, organizerLink, audience, language,
	ageRange, ticketsUrl, isFree, price, availabilityStart, availabilityEnd, keywords], () => {
	if (title.value && startDate.value && startTime.value) {
		emit('update:modelValue', get());
	} else {
		emit('update:modelValue', null);
	}
}, {
	deep: true,
});
</script>

<style lang="scss" scoped>
.container {
	padding: 8px 16px;
}

section {
	margin: 16px 0 0 0;

	.row {
		margin: 0 8px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 12px;

		> section {
			flex: 1 1 auto;
			margin: 0;
		}
	}
}

.advanced {
	padding-top: 16px;
	border-top: 1px solid var(--divider);
	margin-top: 16px;
}

.input {
	flex: 1 1 auto;
}
</style>