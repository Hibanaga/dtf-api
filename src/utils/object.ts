export function invalidateFalsy(object: any): any {
  if (typeof object !== 'object' && object === null) return {};

  const invalidatedArrayEntries = Object.entries(object).filter(
    ([key, value]) => value,
  );
  return { ...Object.fromEntries(invalidatedArrayEntries) };
}

export const caseTransformer = (
  object: any,
  callback: (key: string) => string,
): any => {
  if (typeof object !== 'object' || object === null) return {};

  const entries = Object.entries(object).map(([key, value]) => [
    callback(key),
    value,
  ]);

  return Object.fromEntries(entries);
};
