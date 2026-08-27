import { dev } from "$app/environment";

// place files you want to import through the `$lib` alias in this folder.
export const BACKEND_DOMAIN = dev
  ? "http://localhost:3000"
  : "https://api.tutoring.frqubit.net";
export const COGNITO_BASE_URI =
  "https://us-east-17bvoomwr4.auth.us-east-1.amazoncognito.com";

function getSigninUrl(): string {
  const out = new URL("/login/continue", COGNITO_BASE_URI);
  out.search = new URLSearchParams({
    client_id: "2cq5ns7arvn12i9ll973hdj0f9",
    response_type: "code",
    scope: "email+openid+phone",
    redirect_uri: new URL("/auth", BACKEND_DOMAIN).toString(),
  }).toString();

  // URLSearchParams is stupid and replaces the pluses in the
  // scope with %2B :/
  return out.toString().replaceAll("%2B", "+");
}

function getSignoutUrl(): string {
  const out = new URL("/logout", COGNITO_BASE_URI);
  out.search = new URLSearchParams({
    client_id: "2cq5ns7arvn12i9ll973hdj0f9",
    logout_uri: new URL("/auth/logout", BACKEND_DOMAIN).toString(),
    redirect_uri: new URL("/auth/logout", BACKEND_DOMAIN).toString(),
    response_type: "code",
  }).toString();

  return out.toString();
}

export const SIGNIN_URL = getSigninUrl();
export const SIGNOUT_URL = getSignoutUrl();

export const send_cookie_fetch: typeof fetch = (url, settings) => {
  return fetch(url, {
    ...settings,
    credentials: "include",
  });
};

export function getDateStringOffset() {
  const pad = (n: number) => n.toString().padStart(2, "0");

  // Get timezone offset in minutes and convert to +/-HH:mm
  const tzo = -new Date().getTimezoneOffset();
  const dif = tzo >= 0 ? "+" : "-";
  const offset = `${dif}${pad(Math.floor(Math.abs(tzo) / 60))}:${pad(Math.abs(tzo) % 60)}`;

  return offset;
}

export function toLocalISOString(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const offset = getDateStringOffset();

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    offset
  );
}

export const MS_PER_MINUTE = 1000 * 60;
export const MS_PER_HOUR = MS_PER_MINUTE * 60;
export const MS_PER_DAY = MS_PER_HOUR * 24;
export const MS_PER_WEEK = MS_PER_DAY * 7;
