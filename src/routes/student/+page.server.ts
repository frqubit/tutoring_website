import type { PageServerLoad } from "./$types";
import { StudentFetcher } from "$lib/fetchers";
import { BACKEND_DOMAIN } from "$lib";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const studentFetcher = new StudentFetcher(fetch);
  const students = await studentFetcher.findAll([]);

  return { students };
};
