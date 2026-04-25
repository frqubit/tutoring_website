<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<a href="/student/create" class="text-blue-700">Create</a>

<table class="border-3 w-1/2">
    <thead>
        <tr>
            <th>Name</th>
            <th>Active</th>
        </tr>
    </thead>
    <tbody>
        {#each data.students as student}
            <tr>
                <td
                    ><a href={`/student/${student.id}`} class="text-blue-700"
                        >{student.name}</a
                    ></td
                >
                <td class={student.active ? "text-green-600" : "text-red-600"}
                    >{student.active}</td
                >
            </tr>
        {/each}
    </tbody>
</table>

<style>
    th {
        border-bottom: 2px solid black;
    }

    td {
        text-align: center;
    }
</style>
