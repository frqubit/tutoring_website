<script lang="ts">
    import { localUserInfo } from "$lib/utils/user_utils.svelte";
    import {
        FetcherWithDefaultClientSettings,
        StudentFetcher,
        ClientFetcher,
        SessionFetcher,
    } from "$lib/fetchers";
    import { SessionCompletion } from "$lib/backend/entities/Session.enum";
    import { get_next_month } from "$lib/utils/time_utils";

    const userinfoPromise = localUserInfo();

    async function get_students(clientid: number | undefined) {
        if (!clientid) return [];

        const fetcher = FetcherWithDefaultClientSettings(StudentFetcher);
        return await fetcher.FindAllOfClient({ params: { id: clientid } });
    }

    async function get_next_session(clientid: number | undefined) {
        if (!clientid) return null;

        const clientFetcher = FetcherWithDefaultClientSettings(ClientFetcher);
        const sessions = await clientFetcher.FindAllFutureSessionsOf({
            params: { id: clientid },
        });

        const mostrecent = sessions[0] || null;
        if (mostrecent == null) return null;

        const sessionFetcher = FetcherWithDefaultClientSettings(SessionFetcher);
        const session = await sessionFetcher.FindOne({
            params: { id: mostrecent.id },
        });

        return session || null;
    }

    function safe_div(a: number | undefined, b: number): number | undefined {
        if (a === undefined) return undefined;

        return a / b;
    }

    async function get_completed_sessions(clientid: number | undefined) {
        if (!clientid) return [];

        const fetcher = FetcherWithDefaultClientSettings(ClientFetcher);
        const completed_sessions = await fetcher.FindAllCompletedSessionsOf({
            params: { id: clientid },
        });

        return completed_sessions
            .toSorted((a, b) => a.date.getTime() - b.date.getTime())
            .toReversed();
    }

    async function get_completed_session_total(clientid: number) {
        const completed_sessions = await get_completed_sessions(clientid);

        return (
            safe_div(
                completed_sessions?.reduce((acc, cur) => {
                    let eff_length = cur.minutes;
                    if (cur.completed == SessionCompletion.LATECANCEL) {
                        eff_length *= 0.5;
                    }

                    return acc + eff_length / cur.students.length;
                }, 0),
                60,
            ) || 0
        );
    }

    async function get_deposit_total(clientid: number) {
        const fetcher = FetcherWithDefaultClientSettings(ClientFetcher);
        const deposits = await fetcher.FindAllDepositsOf({
            params: { id: clientid },
        });

        return (
            safe_div(
                deposits
                    ?.map((v) => v.cents)
                    .reduce((acc, cur) => acc + cur, 0),
                100,
            ) || 0
        );
    }

    interface Balance {
        hours: number;
        extra_dollars: number;
    }

    async function get_balance(clientid: number | undefined): Promise<Balance> {
        if (!clientid)
            return {
                hours: 0,
                extra_dollars: 0,
            };

        const deposit_total = await get_deposit_total(clientid);
        const completed_session_total =
            await get_completed_session_total(clientid);

        const left = deposit_total / 35 - completed_session_total;
        const extra = left % 0.25;

        return {
            hours: left - extra,
            extra_dollars: Math.floor(extra * 35 * 4) / 4,
        };
    }
</script>

{#await userinfoPromise then userinfo}
    {#await get_students(userinfo.value?.client?.id) then students}
        <div class="flex flex-row justify-start items-start">
            <div class="flex flex-col justify-start items-start">
                <h1 class="text-3xl font-bold">
                    {userinfo.value?.client?.name}
                </h1>
                <div class="flex flex-col justify-start items-start">
                    {#each students as student}
                        <span>{student.name}</span>
                    {/each}
                </div>
            </div>

            <div
                class="ml-auto border-l-2 pl-2 w-1/2 self-stretch flex flex-col justify-start items-start"
            >
                <span class="text-3xl">Next Session</span>
                {#await get_next_session(userinfo.value?.client?.id) then next_session}
                    {#if next_session != null}
                        <span>{next_session.students[0].name}</span>
                        <span>{next_session.date.toLocaleString()}</span>
                    {/if}
                {/await}
            </div>
        </div>

        <div class="flex flex-col justify-start items-start border-y-3 mt-4">
            <div class="flex flex-row justify-start items-start">
                <span>Balance</span>
                <span class="ml-4">
                    {#await get_balance(userinfo.value?.client?.id) then balance}
                        {balance.hours} hours {balance.extra_dollars > 0
                            ? `+ $${balance.extra_dollars}`
                            : ""}
                    {/await}
                </span>
            </div>
            <span>Next payment on {get_next_month()} 1st</span>
        </div>

        <div class="flex flex-col justify-start items-start mt-4">
            <span class="text-2xl font-bold">Recent Sessions</span>
            <table class="w-full mt-2">
                <tbody>
                    <tr class="border-b-2">
                        <th class="text-left pl-8">Date/Time</th>
                        <th>Student</th>
                        <th>Length</th>
                    </tr>
                    {#await get_completed_sessions(userinfo.value?.client?.id) then completed_sessions}
                        {#each completed_sessions as completed_session}
                            <tr>
                                <td class="pl-8"
                                    >{completed_session.date.toLocaleString()}</td
                                >
                                <td class="text-center">
                                    {completed_session.students.find(
                                        (s) =>
                                            students.find(
                                                (s2) => s2.id == s.id,
                                            ) != undefined,
                                    )?.name}
                                </td>
                                <td class="text-center">
                                    {completed_session.minutes}
                                </td>
                            </tr>
                        {/each}
                    {/await}
                </tbody>
            </table>
        </div>
    {/await}
{/await}
