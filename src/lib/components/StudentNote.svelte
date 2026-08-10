<script lang="ts">
    import { type LatestFormat as StudentNoteFormat } from "$lib/backend/webdata/student_note";
    import ListString from "./input/ListString.svelte";

    interface StudentNoteProps {
        student_note: StudentNoteFormat;
    }

    const { student_note = $bindable() }: StudentNoteProps = $props();
</script>

<div class="grid grid-cols-[auto_1fr] gap-y-3">
    <span class="mr-8">Timezone</span>
    <select bind:value={student_note.timezone}>
        <option value="America/New_York">Eastern</option>
        <option value="America/Chicago">Central</option>
        <option value="America/Denver">Mountain</option>
        <option value="America/Los_Angeles">Pacific</option>
        <option value="America/Phoenix">Arizona</option>
    </select>

    <span class="mr-8">Grade</span>
    <input class="border-b" type="text" bind:value={student_note.grade} />

    <span class="mr-8">Description</span>
    <textarea
        class="border resize-none w-full"
        bind:value={student_note.description}
        rows={5}></textarea>

    <span class="mr-8">Subjects</span>
    <ListString bind:value={student_note.subjects} />

    <span class="mr-8">Goals</span>
    <ListString bind:value={student_note.goals} />
</div>
