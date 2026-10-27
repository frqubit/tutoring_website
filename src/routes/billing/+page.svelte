<script lang="ts">
    import {
        FetcherWithDefaultClientSettings,
        ClientFetcher,
        SessionFetcher,
    } from "$lib/fetchers";
    import { cents_to_dollar_string } from "$lib/utils/display_utils";
    import { get_next_month } from "$lib/utils/time_utils";
    import { localUserInfo } from "$lib/utils/user_utils.svelte";

    const userInfoPromise = localUserInfo();

    async function get_past_invoices() {
        const userInfo = await userInfoPromise;
        const clientId = userInfo.value?.client?.id;
        if (!clientId) return [];

        const fetcher = FetcherWithDefaultClientSettings(ClientFetcher);
        const invoices = await fetcher.FindAllDepositsOf({
            params: { id: clientId },
        });

        return invoices.toReversed();
    }

    async function get_balance() {
        const userInfo = await userInfoPromise;
        const clientId = userInfo.value?.client?.id;
        if (!clientId) return 0;

        const fetcher = FetcherWithDefaultClientSettings(ClientFetcher);
        const balance = await fetcher.GetBalanceOf({
            params: { id: clientId },
        });

        return balance;
    }

    async function get_next_invoice() {
        const userInfo = await userInfoPromise;
        const clientId = userInfo.value?.client?.id;
        if (!clientId) return [];

        const fetcher = FetcherWithDefaultClientSettings(ClientFetcher);
        const charges = await fetcher.GetNextInvoiceOf({
            params: { id: clientId },
        });

        return charges;
    }

    const pastInvoicesPromise = get_past_invoices();
    const getBalancePromise = get_balance();
    const nextInvoicePromise = get_next_invoice();

    let showInvoiceDetails = $state(false);
</script>

<div class="relative flex flex-row justify-start items-start w-full mt-8">
    {#await getBalancePromise}
        <span class="text-7xl font-bold">$...</span>
    {:then balance}
        <span class="text-7xl font-bold">{cents_to_dollar_string(balance)}</span
        >
    {/await}

    <div class="flex flex-col justify-start items-start w-1/2 ml-auto">
        <span class="text-2xl font-light">
            Next invoice on {get_next_month()} 1st
        </span>
        <span class="text-2xl font-light">
            Estimated:
            {#await nextInvoicePromise}
                ...
            {:then nextInvoice}
                {cents_to_dollar_string(
                    nextInvoice.reduce((agg, next) => agg + next.cents, 0),
                )}
            {/await}
        </span>
        {#await nextInvoicePromise then nextInvoice}
            <button
                class="text-blue-500 hover:text-blue-700 active:text-blue-500 select-none"
                onclick={() => (showInvoiceDetails = !showInvoiceDetails)}
            >
                {showInvoiceDetails ? "Hide Details" : "Show Details"}
            </button>
        {/await}
    </div>

    {#await nextInvoicePromise then nextInvoice}
        {#if showInvoiceDetails}
            <div
                class="
                    absolute right-0 top-full w-full h-fit
                    bg-white border mt-4 px-8
                    grid grid-cols-4
                    invoice-grid
                "
            >
                {#each nextInvoice as charge}
                    <!-- <div
                        class="flex flex-row justify-between items-start mx-4 text-2xl w-full"
                    > -->
                    <span>{charge.name}</span>
                    <span>{charge.date.toLocaleDateString()}</span>
                    <span>{charge.student_name}</span>
                    <span class="block">
                        {cents_to_dollar_string(charge.cents)}
                    </span>
                    <!-- </div> -->
                {/each}

                <hr class="w-full col-span-4" />
                <span class="col-start-3 font-bold">Total</span>
                <span class="block font-bold">
                    {cents_to_dollar_string(
                        nextInvoice.reduce((agg, next) => agg + next.cents, 0),
                    )}
                </span>
            </div>
        {/if}
    {/await}
</div>

<div class="mt-8">
    <span class="text-4xl">Past Invoices</span>
    <hr />

    {#await pastInvoicesPromise then pastInvoices}
        {#each pastInvoices as invoice}
            <div class="flex flex-row justify-start items-start text-2xl mt-4">
                <span>{invoice.date.toLocaleString()}</span>
                <span class="ml-auto"
                    >{cents_to_dollar_string(invoice.cents)}</span
                >
            </div>
        {/each}
    {/await}
</div>

<style>
    .invoice-grid > span {
        font-size: 1.5rem;
    }

    .invoice-grid > span:not(:nth-child(4n + 1)) {
        text-align: end;
    }
</style>
