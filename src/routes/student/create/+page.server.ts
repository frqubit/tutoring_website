import type { Actions } from "./$types";
import { StudentFetcher } from "$lib/backend/modules/student/Student.controller";
import { BACKEND_DOMAIN } from "$lib";

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const studentFetcher = new StudentFetcher(BACKEND_DOMAIN, fetch);

    const data = await request.formData();
    const name = data.get("name") as string;
    const active = data.get("active") == "true";

    if (name == null) {
      return;
    }

    const response = await studentFetcher.create(name, active);
    console.log(response);
  },
};
