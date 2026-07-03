<script>
    import Calendar from "$lib/components/Calendar.svelte";

    let cEvents = $state([])
    let cID = $state('main')
    let timeScale = $state([8,23])
</script>

<h1>Hello From Schedule Builder</h1>
<div class="flexRow">
    <Calendar bind:calendarEvents={cEvents} bind:calendarID={cID} bind:timeScale />
</div>