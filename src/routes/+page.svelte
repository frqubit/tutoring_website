<script lang="ts">
    import RecentSessions from "$lib/components/client/RecentSessions.svelte";
    import {
        FetcherWithDefaultClientSettings,
        SessionFetcher,
    } from "$lib/fetchers";

    import { localUserInfo } from "$lib/utils/user_utils.svelte";
    const userInfoPromise = localUserInfo();

    async function get_next_session() {
        const userInfo = await userInfoPromise;
        const clientId = userInfo.value?.client?.id;
        if (!clientId) return null;

        const fetcher = FetcherWithDefaultClientSettings(SessionFetcher);

        const session = await fetcher.FindNextOfClient({
            params: { id: clientId },
        });

        return session;
    }

    const nextSessionPromise = get_next_session();
</script>

<div class="flex flex-row justify-start items-start w-full">
    <div
        class="flex flex-col justify-start items-start w-1/2 ml-auto h-fit bg-gray-300 p-3 select-none"
    >
        <div class="flex flex-row justify-start items-start w-full">
            <span class="font-bold text-4xl">Next Session</span>
            <div
                class="flex flex-col justify-start items-end self-stretch ml-auto"
            >
                <span class="font-light text-4xl">
                    {#await nextSessionPromise}
                        ...
                    {:then nextSession}
                        {nextSession?.date.toLocaleString()}
                    {/await}
                </span>

                <span class="font-light text-2xl">
                    {#await nextSessionPromise}
                        ...
                    {:then nextSession}
                        {nextSession?.minutes} minutes
                    {/await}
                </span>

                <span class="font-light text-2xl">
                    {#await nextSessionPromise}
                        ...
                    {:then nextSession}
                        {#await userInfoPromise}
                            ...
                        {:then userInfo}
                            {nextSession?.students.find(
                                (s) =>
                                    s.client.id == userInfo.value?.client?.id,
                            )?.name || "No Student Of Mine"}
                        {/await}
                    {/await}
                </span>
            </div>
        </div>

        <!-- <span class="font-bold text-2xl text-blue-700">Join Session</span> -->
    </div>
</div>

<div class="w-full flex flex-col justify-start items-start mt-8">
    <span class="font-bold text-3xl">Recent Sessions</span>
    <div class="w-full p-4 bg-gray-100 mt-2 mb-2">
        <RecentSessions {userInfoPromise} />
    </div>
</div>
