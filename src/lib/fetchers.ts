import { redirect } from "@sveltejs/kit";
import { DepositFetcher as DepositFetcherInternal } from "./backend/modules/deposit/Deposit.controller";
import { BACKEND_DOMAIN, SIGNIN_URL } from "$lib";

export class DepositFetcher extends DepositFetcherInternal {
  constructor(fetch_: typeof fetch) {
    super({
      redirect,
      signin_url: SIGNIN_URL,
      fetch: fetch_,
      domain: BACKEND_DOMAIN,
    });
  }
}
