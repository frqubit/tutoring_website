<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<form method="POST" class="flex flex-col">
    <label>
        Student
        <select name="student_id">
            {#each data.students as student}
                <option value={student.id}>{student.name}</option>
            {/each}
        </select>
    </label>
    <label>
        Date
        <input name="date" type="datetime-local" />
    </label>
    <label>
        Minutes
        <input name="minutes" type="text" />
    </label>
    <label>
        Weekly
        <input name="weekly" type="checkbox" />
    </label>
    <button class="bg-blue-900 text-white">Add</button>
</form>
