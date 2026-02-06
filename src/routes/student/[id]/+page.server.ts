import type { Actions, PageServerLoad } from "./$types";
import { StudentFetcher } from "$lib/backend/modules/student/Student.controller";
import { BACKEND_DOMAIN } from "$lib";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const studentFetcher = new StudentFetcher(BACKEND_DOMAIN, fetch);
  const student = await studentFetcher.findOne(+params.id);

  return { student };
};

export const actions: Actions = {
  delete: async ({ fetch, params }) => {
    const studentFetcher = new StudentFetcher(BACKEND_DOMAIN, fetch);

    await studentFetcher.remove(+params.id);

    throw redirect(303, "/student");
  },
};
