<script lang="ts">
    import { SessionFetcher, type FetcherOutput } from "$lib/fetchers";

    interface CalendarTileProps {
        session: FetcherOutput<typeof SessionFetcher, "FindAll">[number];
    }

    const MS_IN_MINUTE = 1000 * 60;
    const MS_IN_DAY = MS_IN_MINUTE * 60 * 24;

    const { session }: CalendarTileProps = $props();

    function calculate_start_time(): string {
        const hour = session.date.getHours();
        const displayHour = hour % 12 == 0 ? 12 : hour % 12;
        const minute = session.date.getMinutes();

        return `${displayHour}:${minute.toString().padStart(2, "0")} ${hour > 11 ? "PM" : "AM"}`;
    }

    const startTime = calculate_start_time();

    const past_and_uncompleted = session.date.getTime() < new Date().getTime() && !session.completed
</script>

<div class={`border-y px-1 flex flex-col w-full ${past_and_uncompleted && "bg-orange-300"}`}>
    <a
        class="font-bold text-blue-500"
        href={`/student/${session.students[0].id}`}
        >{session.students[0].name}
        {session.students.length > 1
            ? `+ ${session.students.length - 1}`
            : ""}</a
    >
    <a class="italic text-blue-500" href={`/session/${session.id}`}
        >{session.date.toDateString()}</a
    >
    <span>
        {startTime} - {session.minutes}min

        {#if session.date.getTime() > new Date().getTime()}
            <a
                class="ml-auto"
                href={`/session/${session.id}/reschedule/${session.index}`}
                >⏱️</a
            >
        {/if}
    </span>
</div>
