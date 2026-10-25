export function getCookie(name: string) {
  const cookies = Object.fromEntries(
    document.cookie.split("; ").map((cookie) => {
      const [key, ...val] = cookie.split("=");
      return [key, decodeURIComponent(val.join("="))];
    }),
  );
  return cookies[name] || null;
}
