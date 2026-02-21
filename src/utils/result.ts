import type { FailureType, SuccessType } from "../types.d.js";

export function Failure({ message, code }: FailureType): FailureType {
	return {
		code,
		message,
	};
}

export function Success<T>({
	message,
	code,
	data,
}: SuccessType<T>): SuccessType<T> {
	return {
		code,
		message,
		data,
	};
}
