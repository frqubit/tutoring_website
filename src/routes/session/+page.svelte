<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<a href="/session/create" class="text-blue-700">Create</a>

<table class="border-3 w-1/2">
    <thead>
        <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Minutes</th>
        </tr>
    </thead>
    <tbody>
        {#each data.sessions as session}
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

<style>
    th {
        border-bottom: 2px solid black;
    }

    td {
        text-align: center;
    }
</style>
