export type TCommonError = {
	status: number;
	errors?: Record<string, any>;
	message: string;
};

export type dbSort = "asc" | "desc"
