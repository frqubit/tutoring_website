import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  let id_token = cookies.get("TAUTHI");

  return {
    signed_in: id_token != undefined,
  };
};
