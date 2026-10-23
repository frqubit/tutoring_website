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

<table class="w-full select-none">
    <tbody>
        <tr class="font-bold text-2xl border-b">
            <th class="text-left w-1/2">Date/Time</th>
            <th class="w-1/4">Student</th>
            <th class="w-1/4">Length</th>
        </tr>
        {#await recentSessionsPromise then recentSessions}
            {#each recentSessions as session}
                <tr class="text-2xl text-center mt-2">
                    <td class="text-left">{session.date.toLocaleString()}</td>
                    <td>
                        {#await userInfoPromise then userInfo}
                            {userInfo.find_student_of_mine(session.students)
                                ?.name}
                        {/await}
                    </td>
                    <td>{session.minutes} minutes</td>
                </tr>
            {/each}
        {/await}
    </tbody>
</table>

<style>
    td {
        padding: 10px 0;
    }
</style>
