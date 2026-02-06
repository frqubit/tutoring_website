<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<a href="/deposit/create" class="text-blue-700">Create</a>

<table class="border-3 w-1/2">
    <thead>
        <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Amount</th>
        </tr>
    </thead>
    <tbody>
        {#each data.deposits as deposit}
            <tr>
                <td
                    ><a href={`/deposit/${deposit.id}`} class="text-blue-700"
                        >{deposit.student.name}</a
                    ></td
                >
                <td>{deposit.date}</td>
                <td>${deposit.cents / 100}</td>
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
