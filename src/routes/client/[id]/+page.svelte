<script lang="ts">
    import { send_cookie_fetch } from "$lib";
    import { ClientFetcher } from "$lib/fetchers";
    import type { PageProps } from "./$types";

    let { data, params }: PageProps = $props();

    let renaming = $state(false);
    let new_name = $state(data.client!.name);

    async function save_rename() {
        const clientFetcher = ClientFetcher(
            send_cookie_fetch,
            URL.parse(window.location.href)!,
        );

        let output = await clientFetcher.Rename(new_name, [data.client!.id]);
        if (output !== null) {
            console.log(output.message);
        } else {
            window.location.reload();
        }
    }

    function safe_div(a: number | undefined, b: number): number | undefined {
        if (a === undefined) return undefined;

        return a / b;
    }

    function get_completed_session_total() {
        return (
            safe_div(
                data.completed_sessions?.reduce(
                    (acc, cur) => acc + cur.minutes / cur.students.length,
                    0,
                ),
                60,
            ) || 0
        );
    }

    function get_deposit_total() {
        return (
            safe_div(
                data.deposits
                    ?.map((v) => v.cents)
                    .reduce((acc, cur) => acc + cur, 0),
                100,
            ) || 0
        );
    }
</script>

{#if data.client && data.deposits}
    <div class="flex flex-row w-full items-center">
        {#if renaming}
            <input
                type="text"
                class="font-bold text-3xl w-1/2"
                bind:value={new_name}
            />
        {:else}
            <h1 class="font-bold text-3xl">
                {data.client.name} ({data.client.active
                    ? "active"
                    : "inactive"})
            </h1>
        {/if}

        <div class="flex flex-row gap-x-6 ml-auto">
            {#if data.client.active}
                <a href={`/client/${params.id}/merge`}>Merge</a>
                <button
                    onclick={async () => {
                        if (renaming && data.client.name != new_name)
                            await save_rename();
                        else renaming = !renaming;
                    }}
                    >{renaming
                        ? data.client.name == new_name
                            ? "Cancel"
                            : "Save"
                        : "Rename"}
                </button>
            {/if}

            <form method="POST" action="?/toggleActive" class="ml-auto">
                <button
                    >{data.client.active
                        ? "Set inactive"
                        : "Set active"}</button
                >
            </form>

            <form method="POST" action="?/delete" class="ml-auto">
                <button class="text-red-700">Delete</button>
            </form>
        </div>
    </div>
    <hr />

    <h2 class="mt-4 mb-2 text-xl">
        Balance: ${get_deposit_total() - get_completed_session_total() * 35} ({get_deposit_total() /
            35 -
            get_completed_session_total()} hours)
    </h2>

    <div class="flex flex-row items-start justify-start gap-x-4">
        <div class="w-1/2">
            <h2 class="mt-4 mb-2 text-xl font-bold">Deposits</h2>

            <table class="border-3 w-full">
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
                        <td>${get_deposit_total()}</td>
                    </tr>
                </tbody>
            </table>
            <h2 class="mt-4 mb-2 text-xl font-bold">Future Sessions</h2>

            <table class="border-3 w-full">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Hours</th>
                        <th></th>
                        <th></th>
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
                            <td class="pl-8">
                                {#if i == 0}
                                    <a
                                        href={`/utils/student/${params.id}/complete/${session.id}`}
                                    >
                                        ✅
                                    </a>
                                {:else}
                                    <span>🗆</span>
                                {/if}
                            </td>
                            <td>
                                <a
                                    href={`/utils/session/${session.id}/remove/${session.index}?pagestudent=1`}
                                >
                                    ❌
                                </a>
                            </td>
                            <td class="pr-8">
                                <a
                                    href={`/session/${session.id}/reschedule/${session.index}`}
                                >
                                    ⏱️
                                </a>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <div class="w-1/2">
            <h2 class="mt-4 mb-2 text-xl font-bold">Completed Sessions</h2>

            <table class="border-3 w-full">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.completed_sessions?.toSorted((a,b)=>a.date.getTime()-b.date.getTime()) as session}
                        <tr>
                            <td
                                ><a
                                    href={`/session/${session.id}`}
                                    class="text-blue-700">{session.date}</a
                                ></td
                            >
                            <td
                                >{session.minutes /
                                    (60 * session.students.length)}</td
                            >
                        </tr>
                    {/each}

                    <tr class="border-t">
                        <td>Total</td>
                        <td>{get_completed_session_total()}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
{:else}
    <h1>Student does not exist</h1>
{/if}

<style>
    th {
        border-bottom: 2px solid black;
    }

    td {
        text-align: center;
    }
</style>
