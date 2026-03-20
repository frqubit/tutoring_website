import type { Actions, PageServerLoad } from "./$types";
import { SessionFetcher } from "$lib/backend/modules/session/Session.controller";
import { BACKEND_DOMAIN } from "$lib";
import { StudentFetcher } from "$lib/backend/modules/student/Student.controller";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const studentFetcher = new StudentFetcher(BACKEND_DOMAIN, fetch);
  const students = await studentFetcher
    .findAll()
    .then((data) => data.filter((s) => s.active));

  return {
    students,
  };
};

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const sessionFetcher = new SessionFetcher(BACKEND_DOMAIN, fetch);

    const data = await request.formData();
    const student_id = data.get("student_id") as string;
    const date = data.get("date") as string;
    const minutes = data.get("minutes") as string;
    const every = data.get("every") as string;

    if (
      student_id == null ||
      date == null ||
      minutes == null ||
      every == null
    ) {
      return;
    }

    const response = await sessionFetcher.create({
      student_id: +student_id,
      date: new Date(date),
      minutes: +minutes,
      every: +every,
      occurrences: +every == 0 ? 0 : 1,
    });
  },
};
