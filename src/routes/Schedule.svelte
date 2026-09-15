<script>
    import Calendar from "$lib/components/Calendar.svelte";
    import ToggleButton from "../lib/components/ToggleButton.svelte";
    import { format12hrTime, formatDaysOfWeek, loadVisibleItems, saveVisibility, loadExtraVisibility, saveExtraVisibility } from '$lib/index.js'
    import { onMount } from "svelte";
    import { colorsArray } from '$lib/styles/colors';
    let {cEvents = []} = $props()
    
    const calendarID = 'main'
    let timeScale = $state([8,23])
    const colors = ['button-primary','button-secondary','button-tertiary','button-quaternary',
    'button-quinary','button-senary','button-septenary','button-octonary'
    ]
    let buttonActive = $state(new Array(8).fill(true))
    let extraActive = $state([])

    function getExtraActive(i, j) {
        return extraActive[i]?.[j] ?? true
    }

    function setExtraActive(i, j, value) {
        if (!extraActive[i]) extraActive[i] = new Array(cEvents[i]?.extraMeetings.length ?? 0).fill(true)
        extraActive[i][j] = value
    }

    onMount(() => {
        buttonActive = loadVisibleItems()
        extraActive = loadExtraVisibility()
    })

    $effect(() => {
        saveVisibility(buttonActive)
        saveExtraVisibility(extraActive)
    })

    $effect.pre(() => {
        const needsSync = cEvents.some((course, i) =>
            (extraActive[i]?.length ?? -1) !== course.extraMeetings.length
        )
        if (needsSync) {
            extraActive = cEvents.map((course, i) =>
                Array.from({ length: course.extraMeetings.length }, (_, j) => extraActive[i]?.[j] ?? true)
            )
        }
    })
</script>

<div class="flexRow" style="margin: 5vh 0 5vh 0">
    <div id="classesHolder" class="surface-base">
        {#if cEvents.length > 0}
            {#each cEvents as item, i }
                <div class="flexCol surface-1" style="align-items: flex-start; text-align: left; padding: 0.3vh 0.3vw 0.3vh 0.3vw;">
                    <div class="flexRowVariant headerRow">
                        <h1 class="title">{item.courseName}</h1>
                        <ToggleButton iconName='visibility' disabledIcon='visibility_off' activeClass={colors[i]} bind:active={buttonActive[i]}/>
                    </div>
                    <p><strong>{item.coursePrefix} {item.courseCode}</strong>.{item.sectionNumber}</p>
                    {#if item.online}
                        <p><strong>Online Class</strong></p>
                    {:else}
                        <p><strong>Room:</strong> {item.room}</p>
                        <p><strong>Meeting Time:</strong> {format12hrTime(item.meetingTime[0])} - {format12hrTime(item.meetingTime[1])}</p>
                        <p><strong>Days:</strong> {formatDaysOfWeek(item.daysOfWeek)}</p>
                    {/if}
                </div>
                
                {#if !item.online && item.extraMeetings.length > 0}
                    {#each item.extraMeetings as extraItem, j}
                        <div class="flexCol surface-2" style="align-items: flex-start; text-align: left; padding: 0.3vh 0.3vw 0.3vh 0.3vw; border-color: {colorsArray[i]};">
                            <div class="flexRowVariant headerRow">
                                <h2 class="title">{extraItem.meetingType} {extraItem.sectionNumber}</h2>
                                <ToggleButton iconName='visibility' disabledIcon='visibility_off' activeClass={colors[i]} bind:active={() => getExtraActive(i, j), (value) => setExtraActive(i, j, value)}/>
                            </div>
                            <p><strong>Room:</strong> {extraItem.room}</p>
                            <p><strong>Meeting Time:</strong> {format12hrTime(extraItem.meetingTime[0])} - {format12hrTime(extraItem.meetingTime[1])}</p>
                            <p><strong>Days:</strong> {formatDaysOfWeek(extraItem.daysOfWeek)}</p>
                        </div>
                    {/each}
                {/if}
            {/each}
        {:else}
            <h2 class="surface-1">No Classes Available</h2>
        {/if}
    </div>
    <Calendar calendarEvents={cEvents} calendarID={calendarID} bind:timeScale eventVisibility={buttonActive} extraVisibility={extraActive} />
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