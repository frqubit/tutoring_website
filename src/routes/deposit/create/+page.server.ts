import type { Actions, PageServerLoad } from "./$types";
import { DepositFetcher } from "$lib/backend/modules/deposit/Deposit.controller";
import { BACKEND_DOMAIN } from "$lib";
import { StudentFetcher } from "$lib/backend/modules/student/Student.controller";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const studentFetcher = new StudentFetcher(BACKEND_DOMAIN, fetch);
  const students = await studentFetcher.findAll();

  return {
    students,
  };
};

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const depositFetcher = new DepositFetcher(BACKEND_DOMAIN, fetch);

    const data = await request.formData();
    const student_id = data.get("student_id") as string;
    const date = data.get("date") as string;
    const cents = data.get("cents") as string;

    if (student_id == null || date == null || cents == null) {
      return;
    }

    const response = await depositFetcher.create({
      student_id: +student_id,
      date: new Date(date),
      cents: +cents,
    });
    console.log(response);
  },
};
