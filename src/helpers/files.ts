export const getFileTypeFromBase64 = (base64: string): string => {
  const result = /^data:(.+);base64,/.exec(base64);
  return result ? result[1] : null;
};
