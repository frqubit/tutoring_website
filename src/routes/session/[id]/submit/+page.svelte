<script lang="ts">
    import { send_cookie_fetch, toLocalISOString } from "$lib";
    import type { PageProps } from "./$types";
    import {
        FetcherWithDefaultClientSettings,
        SessionFetcher,
    } from "$lib/fetchers";
    import { goto } from "$app/navigation";
    import { SessionCompletion } from "$lib/backend/entities/Session.enum";

    let { data }: PageProps = $props();

    let variant: SessionCompletion = $state(SessionCompletion.NONE);

    async function submit_session() {
        const fetcher = FetcherWithDefaultClientSettings(SessionFetcher);

        const result = await fetcher.Submit({
            params: {
                id: data.id,
                variant,
            },
        });

        goto("/calendar", { replaceState: true });
    }
</script>

<div class="flex flex-col">
    <span class="font-bold ml-2"
        >{data.session.students[0].name}
        {data.session.students.length > 1
            ? `+ ${data.session.students.length - 1}`
            : ""}
    </span>
    <span class="font-bold ml-2">{data.session.date.toString()} </span>
    <span class="font-bold ml-2">{data.session.minutes} minutes</span>

    <span class="mt-2 text-2xl">Variant</span>

    <select bind:value={variant} class="w-fit">
        <option value={SessionCompletion.NONE}>Not Completed</option>
        <option value={SessionCompletion.COMPLETED}>Completed</option>
        <option value={SessionCompletion.NOSHOW}>No Show</option>
        <option value={SessionCompletion.LATECANCEL}>Cancelled Late</option>
    </select>

    <button
        onclick={submit_session}
        disabled={variant == SessionCompletion.NONE}
        class="bg-blue-700 text-white mt-4 disabled:bg-gray-500 hover:bg-blue-600 active:bg:blue-700"
    >
        Submit
    </button>
</div>
