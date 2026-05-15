import type { PageServerLoad } from "./$types";
import { SessionFetcher } from "$lib/fetchers";
import { BACKEND_DOMAIN } from "$lib";

const MS_IN_DAY = 1000 * 60 * 60 * 24;
const MS_IN_WEEK = 1000 * 60 * 60 * 24 * 7;

export const load: PageServerLoad = async ({ fetch, url }) => {
  const sessionFetcher = SessionFetcher(fetch, url);
  const start_query = url.searchParams.get("start");
  const start_ms = start_query
    ? +start_query
    : new Date().getTime() - MS_IN_DAY * new Date().getDay();

  const start = new Date(start_ms);
  start.setHours(0, 0, 0, 0);

  const inOneWeek = new Date(start.getTime() + MS_IN_WEEK);

  const sessions = await sessionFetcher.FindAllByFilter(
    {
      start: start,
      end: inOneWeek,
      student_id: undefined,
      completed: undefined,
    },
    [],
  );

  return { sessions, start_ms };
};
