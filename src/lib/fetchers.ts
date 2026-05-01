import { redirect } from "@sveltejs/kit";
import { DepositFetcher as DepositFetcherInternal } from "./backend/modules/deposit/Deposit.controller";
import { StudentFetcher as StudentFetcherInternal } from "./backend/modules/student/Student.controller";
import { SessionFetcher as SessionFetcherInternal } from "./backend/modules/session/Session.controller";
import { BACKEND_DOMAIN, SIGNIN_URL } from "$lib";

export class DepositFetcher extends DepositFetcherInternal {
  constructor(fetch_: typeof fetch, loading_url: URL) {
    super({
      redirect,
      loading_url,
      fetch: fetch_,
      domain: BACKEND_DOMAIN,
    });
  }
}

export class StudentFetcher extends StudentFetcherInternal {
  constructor(fetch_: typeof fetch, loading_url: URL) {
    super({
      redirect,
      loading_url,
      fetch: fetch_,
      domain: BACKEND_DOMAIN,
    });
  }
}

export class SessionFetcher extends SessionFetcherInternal {
  constructor(fetch_: typeof fetch, loading_url: URL) {
    super({
      redirect,
      loading_url,
      fetch: fetch_,
      domain: BACKEND_DOMAIN,
    });
  }
}
