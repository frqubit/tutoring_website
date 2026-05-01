import type { PageServerLoad } from "./$types";
import { StudentFetcher } from "$lib/fetchers";
import { BACKEND_DOMAIN } from "$lib";

export const load: PageServerLoad = async ({ fetch, url }) => {
  const studentFetcher = new StudentFetcher(fetch, url);
  const students = await studentFetcher.findAll([]);

  return { students };
};
