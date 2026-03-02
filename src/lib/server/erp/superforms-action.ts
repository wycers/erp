import type { ActionFailure } from '@sveltejs/kit';
import { toErpActionFailure } from './action-error';

type ErrorPayload = { message: string };

type FormLike = {
	valid: boolean;
	message?: string;
	errors: {
		_errors?: string[];
	};
};

export const toActionErrorMessage = (error: unknown): { status: number; message: string } => {
	const failure = toErpActionFailure(error) as ActionFailure<ErrorPayload>;
	return {
		status: failure.status,
		message: failure.data.message
	};
};

export const setFormMessageError = <T extends FormLike>(form: T, text: string): T => {
	form.valid = false;
	form.message = text;
	form.errors._errors = [text];
	return form;
};
