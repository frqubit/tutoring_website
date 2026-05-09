import { redirect } from "@sveltejs/kit";
import { DepositFetcher as DepositFetcherInternal } from "./backend/modules/deposit/Deposit.handlers";
import { StudentFetcher as StudentFetcherInternal } from "./backend/modules/student/Student.handlers";
import { SessionFetcher as SessionFetcherInternal } from "./backend/modules/session/Session.handlers";
export type { FetcherOutput } from "./backend/utils/handler_utils";
import { BACKEND_DOMAIN, SIGNIN_URL } from "$lib";

export const DepositFetcher = (fetch_: typeof fetch, loading_url: URL) =>
  DepositFetcherInternal({
    redirect,
    loading_url,
    fetch: fetch_,
    domain: BACKEND_DOMAIN,
  });

export const StudentFetcher = (fetch_: typeof fetch, loading_url: URL) =>
  StudentFetcherInternal({
    redirect,
    loading_url,
    fetch: fetch_,
    domain: BACKEND_DOMAIN,
  });

export const SessionFetcher = (fetch_: typeof fetch, loading_url: URL) =>
  SessionFetcherInternal({
    redirect,
    loading_url,
    fetch: fetch_,
    domain: BACKEND_DOMAIN,
  });
