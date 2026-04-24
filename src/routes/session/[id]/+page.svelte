<script lang="ts">
    import type { PageProps } from "./$types";

    let { data, params }: PageProps = $props();
</script>

{#if data.session}
    <div class="flex flex-row w-full items-center">
        <h1 class="font-bold text-3xl">
            <a
                href={`/student/${data.session.student.id}`}
                class="text-blue-700">{data.session.student.name}</a
            >
            ({data.session.minutes} minutes)
        </h1>
        <form method="POST" action="?/delete" class="ml-auto">
            <button>Delete All</button>
        </form>
    </div>
    <hr />
    <div class="flex flex-col">
        <span>
            {data.session.completed ? "Completed on" : "Scheduled for"}
            {data.session.date.toLocaleString()}
        </span>
        {#if data.session.occurrences != 0}
            <span>
                Weekly {data.session.occurrences > 1
                    ? `for ${data.session.occurrences} weeks`
                    : ""}
            </span>
        {/if}

        {#if data.future_dates}
            <h2 class="mt-4 mb-2 text-xl font-bold">Upcoming</h2>

            <table class="border-3 w-1/2">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Minutes</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.future_dates as future, i}
                        <tr>
                            <td>{future.date}</td>
                            <td>{future.minutes}</td>
                            <td class="px-8">
                                <a
                                    href={`/utils/session/${params.id}/remove/${i}`}
                                    >Remove</a
                                >
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>
{:else}
    <h1>Deposit does not exist</h1>
{/if}

<style>
    th {
        border-bottom: 2px solid black;
    }

    td {
        text-align: center;
    }
</style>
