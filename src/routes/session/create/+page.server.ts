import type { Actions, PageServerLoad } from "./$types";
import { SessionFetcher, StudentFetcher } from "$lib/fetchers";
import { BACKEND_DOMAIN, toLocalISOString } from "$lib";

export const load: PageServerLoad = async ({ fetch, url }) => {
  const studentFetcher = StudentFetcher(fetch, url);
  const students = await studentFetcher
    .FindAll({})
    .then((data) => data.filter((s) => s.active));

  return {
    students,
  };
};

export const actions: Actions = {
  default: async ({ request, fetch, url }) => {
    const sessionFetcher = SessionFetcher(fetch, url);

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

    const response = await sessionFetcher.Create({
      body: {
        student_id: +student_id,
        date: new Date(Date.parse(toLocalISOString(new Date(date)))),
        minutes: +minutes,
        every: +every,
        ends: undefined,
      },
    });
  },
};
