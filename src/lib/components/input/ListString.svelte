<script lang="ts">
    interface ListStringProps {
        value: string[];
    }

    let { value = $bindable() }: ListStringProps = $props();

    function add_new_item() {
        value.push("");
    }

    function remove_item(idx: number) {
        value = value.filter((_, i) => i != idx);
    }
</script>

<div class="ml-2 list-disc">
    {#each value as _, i}
        <div class="flex flex-row justify-start items-center gap-x-2">
            <button onclick={() => remove_item(i)}>❌</button>
            <input type="text" class="border-b" bind:value={value[i]} />
        </div>
    {/each}

    <button onclick={add_new_item}>➕</button>
</div>
