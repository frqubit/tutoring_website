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
        class="
            h-fit bg-gray-300 p-3 select-none ml-auto
            w-full lg:w-1/2
            grid grid-cols-2
        "
    >
        <!-- <div class="flex flex-row justify-start items-start w-full"> -->
        <span
            class="
                font-bold
                text-2xl lg:text-4xl
                self-center lg:self-start
            ">Next Session</span
        >
        <span
            class="
                font-light
                col-span-2 lg:col-span-1
                text-start lg:text-end
                text-2xl lg:text-4xl
                mt-2 lg:mt-0
            "
        >
            {#await nextSessionPromise}
                ...
            {:then nextSession}
                {nextSession?.date.toLocaleString()}
            {/await}
        </span>

        <div
            class="
                flex flex-col justify-start
                items-end
                col-start-2
                row-start-1 lg:row-start-2
                text-lg lg:text-2xl
            "
        >
            <span class="font-light">
                {#await nextSessionPromise}
                    ...
                {:then nextSession}
                    {nextSession?.minutes} minutes
                {/await}
            </span>

            <span class="font-light">
                {#await nextSessionPromise}
                    ...
                {:then nextSession}
                    {#await userInfoPromise}
                        ...
                    {:then userInfo}
                        {nextSession?.students.find(
                            (s) => s.client.id == userInfo.value?.client?.id,
                        )?.name || "No Student Of Mine"}
                    {/await}
                {/await}
            </span>
        </div>
        <!-- </div> -->

        <!-- <span class="font-bold text-2xl text-blue-700">Join Session</span> -->
    </div>
</div>

<div class="w-full flex flex-col justify-start items-start mt-8">
    <span class="font-bold text-3xl">Recent Sessions</span>
    <hr class="w-full border-2 md:hidden" />
    <div
        class="
            w-full mt-2 mb-2
            bg-white md:bg-gray-100
            p-0 md:p-4
        "
    >
        <RecentSessions {userInfoPromise} />
    </div>
</div>
