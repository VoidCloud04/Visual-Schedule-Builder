<script>
    import Header from "./Header.svelte";
    import Configuration from "./Configuration.svelte";
    import Documentation from "./Documentation.svelte";
    import Schedule from "./Schedule.svelte";
    import ButtonGroup from "$lib/components/ButtonGroup.svelte";
    import Credits from "./Credits.svelte";

    const mainTabs = [
        {name: 'Schedule Viewer'},
        {name: 'Course Configuration'},
        {name: 'Settings'},
        {name: 'Credits'}
    ]

    let selectedMainTab = $state(0)

    let cEvents = $state([1,2,3,4,5,6,7,8])
</script>

<Header />
<ButtonGroup buttons={mainTabs} bind:selected={selectedMainTab} />
{#if selectedMainTab === 0}
    <Schedule bind:cEvents={cEvents} />
{:else if selectedMainTab === 1}
    <Configuration bind:cEvents={cEvents} />
{:else if selectedMainTab === 2}
    <Documentation />
{:else if selectedMainTab === 3}
    <Credits />
{:else}
    <h1>Invalid Tab</h1>
{/if}


