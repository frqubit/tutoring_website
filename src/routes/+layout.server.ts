import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  let id_token = cookies.get("TAUTHI");
  let auth_token = cookies.get("TAUTH");

  return {
    signed_in: id_token != undefined || auth_token != undefined,
  };
};
