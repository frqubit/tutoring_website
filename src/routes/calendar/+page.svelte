<script lang="ts">
    import type { PageData } from "./$types";
    import CalendarTile from "$lib/components/CalendarTile.svelte";

    let { data } = $props();

    const MS_IN_MINUTE = 1000 * 60;
    const MS_IN_DAY = MS_IN_MINUTE * 60 * 24;

    const start = new Date(data.start_ms);
    start.setHours(0, 0, 0, 0);

    function getSessionsByDay(): (typeof data.sessions)[] {
        const output: (typeof data.sessions)[] = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(start.getTime() + i * MS_IN_DAY);
            const dayStr = date.toDateString();
            const thisDay: typeof data.sessions = [];

            for (let i = 0; i < data.sessions.length; i++) {
                if (data.sessions[i].date.toDateString() == dayStr) {
                    thisDay.push(data.sessions[i]);
                }
            }

            output.push(thisDay);
        }

        return output;
    }

    const sessionsByDay = getSessionsByDay();
</script>

<div class="flex flex-row justify-start">
    <a
        data-sveltekit-reload
        href={`/calendar?start=${data.start_ms - MS_IN_DAY * 7}`}>Last week</a
    >
    <a
        class="ml-4"
        data-sveltekit-reload
        href={`/calendar?start=${data.start_ms + MS_IN_DAY * 7}`}>Next week</a
    >
    <a class="ml-auto" data-sveltekit-reload href="/calendar">Today</a>
</div>

<div class="flex flex-row">
    {#each sessionsByDay as sessions, i}
        <div class="flex-1 border min-h-24 flex flex-col items-center">
            <span class={`font-bold`}
                >{new Date(
                    start.getTime() + i * MS_IN_DAY,
                ).toDateString()}</span
            >

            <hr class="w-full" />

            {#each sessions as session}
                <CalendarTile {session} />
            {/each}
        </div>
    {/each}
</div>
