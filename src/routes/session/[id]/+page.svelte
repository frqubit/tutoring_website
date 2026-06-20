<script lang="ts">
    import { send_cookie_fetch } from "$lib";
    import { StudentFetcher, SessionFetcher } from "$lib/fetchers";
    import type { PageProps } from "./$types";

    let { data, params }: PageProps = $props();

    let adding_student = $state(false);
    let selected_student: number = $state(0);
    let other_students_options: [number, string][] = $state([]);

    async function get_other_students() {
        let studentFetcher = StudentFetcher(
            send_cookie_fetch,
            URL.parse(window.location.href)!,
        );

        const allStudents = await studentFetcher.FindAll(undefined);
        other_students_options = allStudents
            .filter(
                (s) =>
                    s.active &&
                    data.session?.students.find((s2) => s2.name == s.name) ==
                        undefined,
            )
            .map((s) => [s.id, s.name]);

        selected_student = other_students_options[0][0];
    }

    async function add_student() {
        let sessionFetcher = SessionFetcher(
            send_cookie_fetch,
            URL.parse(window.location.href)!,
        );

        await sessionFetcher.AddStudentToSession([
            data.session!.id,
            selected_student,
        ]);

        location.reload();
    }

    async function remove_student(student_id: number) {
        let sessionFetcher = SessionFetcher(
            send_cookie_fetch,
            URL.parse(window.location.href)!,
        );

        const resp = await sessionFetcher.RemoveStudentFromSession([
            data.session!.id,
            student_id,
        ]);

        if (resp && "error" in resp) {
            console.log(resp.message);
        } else {
            location.reload();
        }
    }
</script>

{#if data.session}
    <div class="flex flex-row w-full items-center">
        <h1 class="font-bold text-3xl">
            {data.session.date.toLocaleString()}
            ({data.session.minutes} minutes)
        </h1>
        <form method="POST" action="?/delete" class="ml-auto">
            <button>Delete All</button>
        </form>
    </div>
    <hr />
    <div class="flex flex-col">
        {#if data.session.completed}
            <span> Completed </span>
        {/if}
        {#if data.session.every != 0}
            <span>
                Weekly {data.session.ends
                    ? `until ${data.session.ends.toDateString()}`
                    : ""}
            </span>
        {/if}

        <h2 class="mt-4 mb-2 text-xl font-bold">
            Students
            <button
                class={`${adding_student ? "text-red-500" : ""}`}
                onclick={async () => {
                    await get_other_students();
                    adding_student = !adding_student;
                }}>+</button
            >
        </h2>
        {#each data.session.students as student}
            <div
                class="inline-flex flex-row items-center justify-start not-last:mb-2"
            >
                <button
                    class="bg-red-500 hover:bg-red-400 active:bg-red-500 text-white mr-2 border px-2 font-bold"
                    onclick={() => remove_student(student.id)}>x</button
                >
                <a href={`/student/${student.id}`} class="text-blue-700"
                    >{student.name}</a
                >
            </div>
        {/each}

        {#if adding_student}
            <div class="flex flex-row">
                <select bind:value={selected_student} class="w-[30ch]">
                    {#each other_students_options as other_student}
                        <option value={other_student[0]}
                            >{other_student[1]}</option
                        >
                    {/each}
                </select>
                <button class="ml-2" onclick={add_student}>Save</button>
            </div>
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
