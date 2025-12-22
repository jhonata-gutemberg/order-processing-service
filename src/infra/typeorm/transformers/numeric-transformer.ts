export const numericTransformer = {
    to: (value?: number) => value,
    from: (value?: string) =>
        value === null || value === undefined ? null : Number(value),
};
