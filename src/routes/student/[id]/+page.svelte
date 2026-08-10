<script lang="ts">
    import { enforce } from "$lib/backend/utils/type_utils";
    import { type LatestFormat as StudentNoteFormat } from "$lib/backend/webdata/student_note";
    import StudentNote from "$lib/components/StudentNote.svelte";
    import {
        FetcherWithDefaultClientSettings,
        StudentFetcher,
    } from "$lib/fetchers";
    import type { PageProps } from "./$types";

    let { data, params }: PageProps = $props();

    let renaming = $state(false);
    let new_name = $state(data.student!.name);

    const DEFAULT_STUDENT_NOTE = enforce<StudentNoteFormat>({
        grade: "[GRADE]",
        subjects: ["[SUBJECT]"],
        description: "[DESCRIPTION]",
        goals: ["[GOALS]"],
    });

    let student_note = $state(data.student_note || DEFAULT_STUDENT_NOTE);

    async function save_rename() {
        const studentFetcher = FetcherWithDefaultClientSettings(StudentFetcher);

        let output = await studentFetcher.Rename({
            body: new_name,
            params: { id: data.student!.id },
        });
        if ("error" in output) {
            console.log(output.message);
        } else {
            window.location.reload();
        }
    }

    async function save_student_note() {
        const studentFetcher = FetcherWithDefaultClientSettings(StudentFetcher);

        let output = await studentFetcher.SaveStudentNote({
            params: { id: +params.id },
            body: student_note,
        });

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

    async function toggle_active() {
        const studentFetcher = FetcherWithDefaultClientSettings(StudentFetcher);
        await studentFetcher.ToggleActive({ params: { id: data.student!.id } });

        window.location.reload();
    }
</script>

{#if data.student}
    <div class="flex flex-row w-full items-center">
        {#if renaming}
            <input
                type="text"
                class="font-bold text-3xl w-1/2"
                bind:value={new_name}
            />
        {:else}
            <h1
                class={`font-bold text-3xl ${!data.student.active && "text-red-800"}`}
            >
                {data.student.name}
            </h1>
        {/if}

        <div class="flex flex-row gap-x-6 ml-auto">
            {#if data.student.active}
                <button
                    onclick={async () => {
                        if (renaming && data.student.name != new_name)
                            await save_rename();
                        else renaming = !renaming;
                    }}
                    >{renaming
                        ? data.student.name == new_name
                            ? "Cancel"
                            : "Save"
                        : "Rename"}
                </button>
            {/if}

            <button class="ml-auto" onclick={toggle_active}
                >{data.student.active ? "Set inactive" : "Set active"}</button
            >

            <form method="POST" action="?/delete" class="ml-auto">
                <button class="text-red-700">Delete</button>
            </form>
        </div>
    </div>
    <hr />

    <h2 class="mt-4 mb-2 text-xl font-bold">Client</h2>
    <a href={`/client/${data.student.client.id}`} class="text-blue-700"
        >{data.student.client.name}</a
    >

    <div class="flex flex-row items-start justify-start gap-x-4">
        <div class="w-1/2">
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
            <StudentNote bind:student_note />
            <button
                class="w-full mt-6 bg-green-500 border-2 font-bold active:bg-green-500 hover:bg-green-400"
                onclick={save_student_note}
            >
                Save
            </button>
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
