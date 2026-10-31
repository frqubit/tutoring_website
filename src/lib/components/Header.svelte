<script lang="ts">
    import { dev } from "$app/environment";
    import { SIGNIN_URL, SIGNOUT_URL } from "$lib";
    import { localUserInfo } from "$lib/utils/user_utils.svelte.js";
    import AdminBe from "./AdminBe.svelte";
    import Hamburger from "$lib/assets/hamburger.svg";
    import { onNavigate } from "$app/navigation";

    let { signed_in } = $props();

    let userInfo = localUserInfo();

    let hamburgered = $state(false);

    onNavigate((navigation) => {
        hamburgered = false;
    });
</script>

<div class="w-full border-b-2 mb-4 flex flex-row items-center gap-x-5 relative">
    <button class="md:hidden" onclick={() => (hamburgered = !hamburgered)}>
        <img src={Hamburger} class="h-full" alt="hamburger" />
    </button>
    <div
        class={`
            ${hamburgered ? "absolute" : "hidden"} md:contents
            bg-gray-100 md:bg-transparent
            border-t-2 md:border-none
            left-0 top-full
            w-full md:w-fit
            flex flex-col justify-start items-start
            px-2 py-1 md:p-0
            z-10 md:z-0
        `}
    >
        {#await userInfo}
            <a href="/" class="text-blue-700 text-xl font-semibold">Homepage</a>
            <a href="/billing" class="text-blue-700 text-xl font-semibold">
                Billing
            </a>
        {:then userInfo}
            {#if userInfo.value?.is_administrator && userInfo.value.client == undefined}
                <a href="/admin" class="text-red-700 text-xl font-semibold">
                    Homepage
                </a>

                <a
                    href="/admin/student"
                    class="text-blue-700 text-xl font-semibold">Students</a
                >
                <a
                    href="/admin/client"
                    class="text-blue-700 text-xl font-semibold">Clients</a
                >
                <a
                    href="/admin/calendar"
                    class="text-blue-700 text-xl font-semibold">Calendar</a
                >
            {:else}
                <a href="/" class="text-blue-700 text-xl font-semibold">
                    Homepage
                </a>

                <a href="/billing" class="text-blue-700 text-xl font-semibold">
                    Billing
                </a>

                <a href="/upcoming" class="text-blue-700 text-xl font-semibold">
                    Schedule
                </a>
            {/if}
        {/await}
    </div>

    {#if !signed_in}
        <a href={SIGNIN_URL} class="text-blue-700 ml-auto">Sign in</a>
    {:else}
        <div class="ml-auto flex flex-row items-center gap-x-5">
            {#await userInfo then userInfo}
                {#if userInfo.value?.client?.id}
                    <!-- <a class="text-blue-700" href={`/profile`}
                        >{userInfo.value.client.name}</a
                    > -->
                {:else if userInfo.value?.is_administrator}
                    <span class="text-red-700 bold select-none"
                        >Administrator</span
                    >
                {/if}
            {/await}
            {#await userInfo then userInfo}
                {#if dev || userInfo.value?.is_administrator}
                    <AdminBe />
                {/if}

                <a
                    href={SIGNOUT_URL}
                    class={`text-blue-700 ${dev ? "md:hidden" : ""}`}
                    >Sign out</a
                >
            {/await}
        </div>
    {/if}
</div>
