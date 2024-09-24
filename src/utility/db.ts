export const getPageQuery = (stringPage: string) => {
    const page = Number(stringPage ?? "1");

    if (Number.isNaN(page) || page < 1) {
        return 1;
    }
    return page
}