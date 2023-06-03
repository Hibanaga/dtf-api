export function snakeCase(string: string): string {
  return string.replace(/[A-Z]/g, (message) => '_' + message.toLowerCase());
}

export function camelCase(string: string): string {
  return string.replace(/_([a-z])/g, (message, p1) => p1.toUpperCase());
}
