type FailureType = {
	code: number;
	message: string;
};

type SuccessType<T> = {
	code: number;
	message: string;
	data: T;
};

export type Result<T> = FailureType | SuccessType<T>;
