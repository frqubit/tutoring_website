<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<a href="/client/create" class="text-blue-700">Create</a>

<table class="border-3 w-1/2">
    <thead>
        <tr>
            <th>Name</th>
            <th>Active</th>
        </tr>
    </thead>
    <tbody>
        {#each data.clients as client}
            <tr>
                <td
                    ><a href={`/client/${client.id}`} class="text-blue-700"
                        >{client.name}</a
                    ></td
                >
                <td class={client.active ? "text-green-600" : "text-red-600"}
                    >{client.active}</td
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
