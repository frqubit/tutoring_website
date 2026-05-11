import type { Actions, PageServerLoad } from "./$types";
import { DepositFetcher, StudentFetcher } from "$lib/fetchers";

export const load: PageServerLoad = async ({ fetch, url }) => {
  const studentFetcher = StudentFetcher(fetch, url);
  const students = await studentFetcher
    .FindAll([])
    .then((data) => data.filter((s) => s.active));

  return {
    students,
  };
};

export const actions: Actions = {
  default: async ({ request, fetch, url }) => {
    const depositFetcher = DepositFetcher(fetch, url);

    const data = await request.formData();
    const student_id = data.get("student_id") as string;
    const date = data.get("date") as string;
    const cents = data.get("cents") as string;

    if (student_id == null || date == null || cents == null) {
      return;
    }

    const response = await depositFetcher.Create(
      {
        student_id: +student_id,
        date: new Date(date),
        cents: +cents,
      },
      [],
    );
    console.log(response);
  },
};
