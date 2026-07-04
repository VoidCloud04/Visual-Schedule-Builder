<script>
    import Calendar from "$lib/components/Calendar.svelte";
    import ToggleButton from "../lib/components/ToggleButton.svelte";
    import { format12hrTime, formatDaysOfWeek, loadVisibleItems, saveVisibility } from '$lib/index.js'
    import { onMount } from "svelte";
    let {cEvents = []} = $props()
    
    const calendarID = 'main'
    let timeScale = $state([8,23])
    const colors = ['button-primary','button-secondary','button-tertiary','button-quaternary',
    'button-quinary','button-senary','button-septenary','button-octonary'
    ]
    let buttonActive = $state(new Array(8).fill(true))

    onMount(() => {
        buttonActive = loadVisibleItems()
    })

    $effect(() => {
        saveVisibility(buttonActive)
    })
</script>

<div class="flexRow" style="margin: 5vh 0 5vh 0">
    <div id="classesHolder" class="surface-base">
        {#if cEvents.length > 0}
            {#each cEvents as item, i }
                <div class="flexCol surface-1" style="align-items: flex-start; text-align: left; padding: 0.3vh 0.3vw 0.3vh 0.3vw;">
                    <div class="flexRowVariant headerRow">
                        <h1 class="title">{item.coursePrefix} {item.courseCode}.<span style="font-size: 20px">{item.sectionNumber}</span></h1>
                        <ToggleButton iconName='visibility' disabledIcon='visibility_off' activeClass={colors[i]} bind:active={buttonActive[i]}/>
                    </div>
                    <p><strong>{item.courseName}</strong> | <strong>{item.room}</strong></p>
                    <p><strong>Meeting Time:</strong> {format12hrTime(item.meetingTime[0])}-{format12hrTime(item.meetingTime[1])} | <strong>Days:</strong> {formatDaysOfWeek(item.daysOfWeek)}</p>
                    
                    {#if item.extraMeetings.length > 0}
                        <strong><br>Extra Sections:</strong>
                        {#each item.extraMeetings as extraItem}
                            <p class="surface-2" style="margin: 2px 0 2px 0">
                                <strong>{extraItem.meetingType} {extraItem.sectionNumber} | {extraItem.room} | {format12hrTime(extraItem.meetingTime[0])}-{format12hrTime(extraItem.meetingTime[1])} | Days: {formatDaysOfWeek(extraItem.daysOfWeek)}</strong>
                            </p>
                        {/each}
                    {/if}
                </div>
            {/each}
        {:else}
            <h2 class="surface-1">No Classes Available</h2>
        {/if}
    </div>
    <Calendar calendarEvents={cEvents} calendarID={calendarID} bind:timeScale eventVisibility={buttonActive} />
</div>

<style lang="scss">
    @use '$lib/styles/variables' as *;

    #classesHolder {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;

        height: 40vw;
        width: 60vw;

        overflow-y: auto;
        overflow-x: hidden;

        gap: 0.5vh;

        align-items: left;

        * {
            margin: 0;
        }
    }

    .headerRow {
        display: flex;
        align-items: center;
        width: 100%;
    }

    .title {
        margin: 0;
        flex: 1; 
        text-align: left;
    }
</style>