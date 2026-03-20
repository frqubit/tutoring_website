<script lang="ts">
    import type { PageProps } from "./$types";

    let { data, params }: PageProps = $props();

    function safe_div(a: number | undefined, b: number): number | undefined {
        if (a === undefined) return undefined;

        return a / b;
    }

    const completed_session_total =
        safe_div(
            data.completed_sessions
                ?.map((v) => v.minutes)
                .reduce((acc, cur) => acc + cur, 0),
            60,
        ) || 0;

    const deposit_total =
        safe_div(
            data.deposits
                ?.map((v) => v.cents)
                .reduce((acc, cur) => acc + cur, 0),
            100,
        ) || 0;
</script>

{#if data.student && data.deposits}
    <div class="flex flex-row w-full items-center">
        <h1 class="font-bold text-3xl">
            {data.student.name} ({data.student.active ? "active" : "inactive"})
        </h1>

        <form method="POST" action="?/delete" class="ml-auto">
            <button>Delete</button>
        </form>
    </div>
    <hr />

    <h2 class="mt-4 mb-2 text-xl">
        Balance: ${deposit_total - completed_session_total * 35} ({deposit_total /
            35 -
            completed_session_total} hours)
    </h2>

    <h2 class="mt-4 mb-2 text-xl font-bold">Deposits</h2>

    <table class="border-3 w-1/2">
        <thead>
            <tr>
                <th>Date</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            {#each data.deposits as deposit}
                <tr>
                    <td
                        ><a
                            href={`/deposit/${deposit.id}`}
                            class="text-blue-700">{deposit.date}</a
                        ></td
                    >
                    <td>${deposit.cents / 100}</td>
                </tr>
            {/each}

            <tr class="border-t-1">
                <td>Total</td>
                <td>${deposit_total}</td>
            </tr>
        </tbody>
    </table>
    <h2 class="mt-4 mb-2 text-xl font-bold">Future Sessions</h2>

    <table class="border-3 w-1/2">
        <thead>
            <tr>
                <th>Date</th>
                <th>Hours</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {#each data.future_sessions as session, i}
                <tr>
                    <td
                        ><a
                            href={`/session/${session.id}`}
                            class="text-blue-700">{session.date}</a
                        ></td
                    >
                    <td>{session.minutes / 60}</td>
                    <td class="px-8">
                        {#if i == 0}
                            <a
                                href={`/utils/student/${params.id}/complete/${session.id}`}
                            >
                                Complete
                            </a>
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>

    <h2 class="mt-4 mb-2 text-xl font-bold">Completed Sessions</h2>

    <table class="border-3 w-1/2">
        <thead>
            <tr>
                <th>Date</th>
                <th>Hours</th>
            </tr>
        </thead>
        <tbody>
            {#each data.completed_sessions as session}
                <tr>
                    <td
                        ><a
                            href={`/session/${session.id}`}
                            class="text-blue-700">{session.date}</a
                        ></td
                    >
                    <td>{session.minutes / 60}</td>
                </tr>
            {/each}

            <tr class="border-t-1">
                <td>Total</td>
                <td>{completed_session_total}</td>
            </tr>
        </tbody>
    </table>
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
