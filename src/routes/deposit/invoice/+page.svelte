<script lang="ts">
    import type { PageProps } from "./$types";
    import {
        SessionFetcher,
        StudentFetcher,
        type FetcherOutput,
    } from "$lib/fetchers";
    import { send_cookie_fetch } from "$lib";

    const MONTHS = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    let { data }: PageProps = $props();

    let student = $state(data.students[0].id);
    let month = $state((new Date().getMonth() + 2) % 12);
    let year2 = $state(new Date().getFullYear() % 100);

    let sessions: FetcherOutput<typeof SessionFetcher, "FindAllByFilter"> =
        $state([]);

    async function refreshSessions() {
        const fetcher = SessionFetcher(
            send_cookie_fetch,
            URL.parse(window.location.href)!,
        );

        const nextMonth = month == 12 ? 1 : month + 1;
        const nextYear2 = month == 12 ? year2 + 1 : year2;

        const result = await fetcher.FindAllByFilter({
            student_id: student,
            start: new Date(
                Date.parse(
                    `20${year2}-${month < 10 ? "0" + month : month}-01T00:00:00.000Z`,
                ),
            ),
            end: new Date(
                Date.parse(
                    `20${nextYear2}-${nextMonth < 10 ? "0" + nextMonth : nextMonth}-01T00:00:00.000Z`,
                ),
            ),
            completed: false,
        });

        sessions = result;
    }

    let parent_name: string = $state("");
    let invoice: string = $state("");

    async function generateInvoice() {
        const studentFetcher = StudentFetcher(
            send_cookie_fetch,
            URL.parse(window.location.href)!,
        );
        const sessionFetcher = SessionFetcher(
            send_cookie_fetch,
            URL.parse(window.location.href)!,
        );

        const lastMonth = month == 1 ? 12 : month - 1;
        const lastYear2 = month == 1 ? year2 - 1 : year2;

        const sessionsThisMonth = await sessionFetcher.FindAllByFilter({
            student_id: student,
            start: new Date(
                Date.parse(
                    `20${lastYear2}-${lastMonth < 10 ? "0" + lastMonth : lastMonth}-01T00:00:00.000Z`,
                ),
            ),
            end: new Date(
                Date.parse(
                    `20${year2}-${month < 10 ? "0" + month : month}-01T00:00:00.000Z`,
                ),
            ),
            completed: false,
        });

        const totalThisMonthNotDone =
            (sessionsThisMonth
                .map((s) => s.minutes)
                .reduce((agg, next) => agg + next, 0) *
                3500) /
            60;

        const remainingBalance =
            (await studentFetcher.GetBalanceOf([student])) -
            totalThisMonthNotDone;
        const clarifyBalanceStr =
            remainingBalance == 0
                ? ":"
                : remainingBalance > 0
                  ? `. However, you still have $${remainingBalance / 100} that hasn't been used:`
                  : `. However, you used ${remainingBalance / -3500} hour${remainingBalance == -3500 ? "" : "s"} since the last payment that ${remainingBalance == -3500 ? "wasn't" : "weren't"} planned:`;
        const hourModify = remainingBalance / 3500;

        const sessions_string = sessions
            .map(
                (s) =>
                    `${MONTHS[s.date.getMonth()]} ${s.date.getDate()} (${s.minutes / 60} hour${s.minutes == 60 ? "" : "s"})`,
            )
            .join("\n");
        const total_hours =
            sessions
                .map((s) => s.minutes)
                .reduce((agg, next) => agg + next, 0) / 60;

        const finalHoursStr =
            hourModify == 0
                ? `${total_hours}`
                : hourModify > 0
                  ? `(${total_hours}-${hourModify})`
                  : `(${total_hours}+${-hourModify})`;

        invoice = `Hello ${parent_name}. Here's all the sessions for ${MONTHS[month - 1]}:

${sessions_string}

That's ${total_hours} hour${total_hours == 1 ? "" : "s"} total${clarifyBalanceStr}

${finalHoursStr}×35=$${(total_hours - hourModify) * 35} due`;
    }
</script>

<div class="flex flex-col justify-start">
    <div class="flex flex-row">
        <span class="mr-4">Student</span>
        <select bind:value={student}>
            {#each data.students as student}
                <option value={student.id}>{student.name}</option>
            {/each}
        </select>
    </div>

    <div class="flex flex-row">
        <span class="mr-4">Month</span>
        <select bind:value={month}>
            <option value={1}>January</option>
            <option value={2}>February</option>
            <option value={3}>March</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
        </select>
    </div>

    <div class="flex flex-row">
        <span class="mr-4">Year</span>
        <span class="mr-1">20</span>
        <input type="text" bind:value={year2} />
    </div>

    <button onclick={refreshSessions}> Refresh </button>
</div>

<table class="border-3 w-1/2">
    <thead>
        <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Minutes</th>
        </tr>
    </thead>
    <tbody>
        {#each sessions as session}
            <tr>
                <td
                    ><a href={`/session/${session.id}`} class="text-blue-700"
                        >{session.student.name}</a
                    ></td
                >
                <td>{session.date}</td>
                <td>{session.minutes}</td>
            </tr>
        {/each}
    </tbody>
</table>

{#if sessions.length > 0}
    <div class="mt-2 flex flex-col w-1/2">
        <input
            type="text"
            placeholder="Parent Name"
            class="border-b w-1/2"
            bind:value={parent_name}
        />
        <button
            class="px-2 py-1 font-bold w-1/2 mt-2 cursor-pointer"
            onclick={generateInvoice}>Generate Invoice Text</button
        >

        <p class="whitespace-pre">{invoice}</p>
    </div>
{/if}

<style>
    th {
        border-bottom: 2px solid black;
    }

    td {
        text-align: center;
    }
</style>
