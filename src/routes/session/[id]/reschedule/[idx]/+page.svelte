<script lang="ts">
    import { send_cookie_fetch, toLocalISOString } from "$lib";
    import type { PageProps } from "./$types";
    import { SessionFetcher } from "$lib/fetchers";
    import { goto } from "$app/navigation";

    let { data }: PageProps = $props();

    let date = $state(toLocalISOString(data.session.date).slice(0, 19));
    let minutes = $state(data.session.minutes);

    async function do_reschedule(all: boolean) {
        const fetcher = SessionFetcher(
            send_cookie_fetch,
            URL.parse(window.location.href)!,
        );

        const result = await fetcher.Reschedule(
            {
                date: new Date(Date.parse(toLocalISOString(new Date(date)))),
                minutes: +minutes,
                all,
            },
            [data.id, data.idx],
        );

        goto("/calendar", { replaceState: true });
    }
</script>

<div class="flex flex-col">
    <div class="flex flex-row">
        Student
        <span class="font-bold ml-2">{data.session.student.name}</span>
    </div>
    <div class="flex flex-row">
        Date
        <input
            class="ml-2"
            name="date"
            type="datetime-local"
            bind:value={date}
        />
    </div>
    <div class="flex flex-row">
        Minutes
        <input class="ml-2" name="minutes" type="text" bind:value={minutes} />
    </div>

    <button
        class="flex-1 bg-blue-900 hover:bg-blue-700 active:bg-blue-900 text-white"
        onclick={() => do_reschedule(false)}
        >Reschedule {data.session.every != 0 ? "One" : ""}</button
    >
    {#if data.session.every != 0}
        <button
            class="flex-1 bg-red-900 hover:bg-red-700 active:bg-red-900 text-white mt-2"
            onclick={() => do_reschedule(true)}>Reschedule All</button
        >
    {/if}
</div>
