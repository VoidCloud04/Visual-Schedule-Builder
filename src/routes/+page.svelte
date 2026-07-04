<script>
    import Header from "./Header.svelte";
    import Configuration from "./Configuration.svelte";
    import Documentation from "./Documentation.svelte";
    import Schedule from "./Schedule.svelte";
    import ButtonGroup from "$lib/components/ButtonGroup.svelte";
    import Credits from "./Credits.svelte";

    const mainTabs = [
        {name: 'Schedule Builder'},
        {name: 'Configuration'},
        {name: 'Docs'},
        {name: 'Credits'}
    ]

    let selectedMainTab = $state(0)
</script>

<Header />
<ButtonGroup buttons={mainTabs} bind:selected={selectedMainTab} />
{#if selectedMainTab === 0}
    <Schedule />
{:else if selectedMainTab === 1}
    <Configuration />
{:else if selectedMainTab === 2}
    <Documentation />
{:else if selectedMainTab === 3}
    <Credits />
{:else}
    <h1>Invalid Tab</h1>
{/if}


