<script>
    import Calendar from "$lib/components/Calendar.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import IconButton from "$lib/components/IconButton.svelte";

    let cEvents = $state([])
    let cID = $state('main')
    let timeScale = $state([8,23])
</script>

<h1>Hello From Schedule Builder</h1>
<div class="flexRow">
    <div id="classesHolder" class="flexCol">
        {#if cEvents.length > 0}
            <p>We got Classes!</p>
        {:else}
            <h3>No Classes Displayed</h3>
        {/if}
    </div>
    <Calendar bind:calendarEvents={cEvents} bind:calendarID={cID} bind:timeScale />
</div>

<style lang="scss">
    @use '$lib/styles/variables' as *;

    #classesHolder {
        height: 40vh;
        width: 55vw;
    }
</style>