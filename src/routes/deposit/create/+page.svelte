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
        <input
            name="date"
            type="date"
            value={new Date().toISOString().split("T")[0]}
        />
    </label>
    <label>
        Cents
        <input name="cents" type="text" />
    </label>
    <button type="submit" class="bg-blue-900 text-white">Add</button>
</form>
