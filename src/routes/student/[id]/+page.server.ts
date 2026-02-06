import type { PageServerLoad } from "./$types";
import { StudentFetcher } from "$lib/backend/modules/student/Student.controller";
import { BACKEND_DOMAIN } from "$lib";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const studentFetcher = new StudentFetcher(BACKEND_DOMAIN, fetch);
  const student = await studentFetcher.findOne(+params.id);

  return { student };
};
