export type TCommonError = {
	status: number;
	errors?: Record<string, unknown>;
	message: string;
	data?: Record<string, unknown>
};

export type dbSort = "asc" | "desc"
