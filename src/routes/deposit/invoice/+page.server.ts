import { StudentFetcher } from "$lib/fetchers";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, url }) => {
  const studentFetcher = StudentFetcher(fetch, url);
  const students = await studentFetcher
    .FindAll([])
    .then((data) => data.filter((s) => s.active));

  return {
    students,
  };
};
