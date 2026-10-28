<script lang="ts">
    import {
        FetcherWithDefaultClientSettings,
        ClientFetcher,
    } from "$lib/fetchers";
    import { UserInfoCls } from "$lib/utils/user_utils.svelte";

    const {
        userInfoPromise,
    }: {
        userInfoPromise: Promise<UserInfoCls>;
    } = $props();

    async function get_recent_sessions() {
        const userInfo = await userInfoPromise;
        const clientId = userInfo.value?.client?.id;
        if (!clientId) return null;

        const fetcher = FetcherWithDefaultClientSettings(ClientFetcher);
        const sessions = await fetcher.FindRecentCompletedSessionsOf({
            params: { id: clientId },
        });

        console.log(sessions);

        return sessions;
    }

    const recentSessionsPromise = get_recent_sessions();
</script>

<div
    class="
        w-full select-none
        flex flex-col justify-start items-start
        md:grid md:grid-cols-3
    "
>
    <div
        class="
            font-bold text-2xl
            hidden md:contents
        "
    >
        <span class="text-left">Date/Time</span>
        <span class="w-full text-center">Student</span>
        <span class="w-full text-center">Length</span>
    </div>
    <hr
        class="
            w-full col-span-3
            hidden md:block
        "
    />
    {#await recentSessionsPromise then recentSessions}
        {#each recentSessions as session}
            <div
                class="text-lg sm:text-2xl text-center mt-2 contents recentSession"
            >
                <span
                    class="text-left sm:pt-3 md:py-3 text-xl sm:text-3xl md:text-2xl"
                    >{session.date.toLocaleString()}</span
                >
                <div
                    class="
                        flex flex-row justify-start items-start md:contents
                        border-b border-dashed md:border-none
                        w-full
                        mb-2 sm:mb-0
                    "
                >
                    <span class="pt-1 mb-1 sm:mb-3 md:py-3 md:mb-0">
                        {#await userInfoPromise then userInfo}
                            {userInfo.find_student_of_mine(session.students)
                                ?.name}
                        {/await}
                    </span>
                    <span class="text-lg sm:text-2xl md:hidden mr-2">,</span>
                    <span class="pt-1 pb-1 sm:pb-3 md:py-3">
                        {session.minutes} minutes
                    </span>
                </div>
            </div>
        {/each}
    {/await}
</div>

<style>
    .recentSession:last-child > div {
        border: none;
    }
</style>
