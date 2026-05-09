import type { PageServerLoad } from "./$types";
import { StudentFetcher } from "$lib/fetchers";
import { BACKEND_DOMAIN } from "$lib";

export const load: PageServerLoad = async ({ fetch, url }) => {
  const studentFetcher = StudentFetcher(fetch, url);
  const students = await studentFetcher.FindAll([]);

  return { students };
};
