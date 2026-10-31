<script lang="ts">
    import {
        FetcherWithDefaultClientSettings,
        ClientFetcher,
    } from "$lib/fetchers";
    import { date_minutes_to_duration_string } from "$lib/utils/display_utils";
    import { localUserInfo } from "$lib/utils/user_utils.svelte";

    const userInfoPromise = localUserInfo();

    async function getNextSessions() {
        const userInfo = await userInfoPromise;
        const clientId = userInfo.value?.client?.id;
        if (!clientId) return {};

        const fetcher = FetcherWithDefaultClientSettings(ClientFetcher);
        const sessions = await fetcher.FindAllFutureSessionsOf({
            params: { id: clientId },
        });

        const sorted_dates = sessions.reduce(
            (agg, next) => {
                const dateStr = next.date.toLocaleDateString();
                if (dateStr in agg) {
                    agg[dateStr].push(next);
                } else {
                    agg[dateStr] = [next];
                }

                return agg;
            },
            {} as Record<string, (typeof sessions)[number][]>,
        );

        return sorted_dates;
    }

    const nextSessionsPromise = getNextSessions();
</script>

{#await nextSessionsPromise then nextSessions}
    {#each Object.entries(nextSessions) as dateSessions}
        <div class="flex flex-col justify-start items-start w-full mt-8">
            <span class="text-3xl md:text-5xl font-bold md:ml-2"
                >{dateSessions[0]}</span
            >
            <hr class="w-full" />
            {#each dateSessions[1] as session}
                <div
                    class="md:ml-6 mt-4 flex flex-col justify-start items-start"
                >
                    <span
                        class="
                            text-2xl md:text-3xl
                        "
                    >
                        {date_minutes_to_duration_string(
                            session.date,
                            session.minutes,
                        )}
                    </span>
                    <span class="text-base md:text-xl ml-4">
                        {#await userInfoPromise}
                            ...
                        {:then userInfo}
                            {userInfo.find_student_of_mine(session.students)
                                ?.name}
                        {/await}
                    </span>
                </div>
            {/each}
        </div>
    {/each}
{/await}
