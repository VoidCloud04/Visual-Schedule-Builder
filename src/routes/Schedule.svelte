<script>
    import Calendar from "$lib/components/Calendar.svelte";
    import ToggleButton from "../lib/components/ToggleButton.svelte";
    import ButtonGroup from "$lib/components/ButtonGroup.svelte";
    import { format12hrTime, formatDaysOfWeek } from '$lib/index.js'
    import { colorsArray } from '$lib/styles/colors';
    let {cEvents = [], semesters = [], selectedSemester = $bindable(), switchSemester = () => {}, use24Hour = false, buttonActive = $bindable(), extraActive = $bindable()} = $props()
    
    const calendarID = 'main'
    let timeScale = $state([8,23])
    const colors = ['button-primary','button-secondary','button-tertiary','button-quaternary',
    'button-quinary','button-senary','button-septenary','button-octonary'
    ]
    let semesterButtons = $derived(semesters.map(semester => ({name: `${semester.name} ${semester.hourTotal > 0 ? '('+semester.hourTotal : ''} ${semester.hourTotal > 0 ? `Hour${semester.hourTotal > 1 ? 's' : ''})` : ''}`})))
    let semesterIndex = $derived(semesters.findIndex(semester => semester.id === selectedSemester))

    function changeSemester(index) {
        if(index >= 0 && index < semesters.length) switchSemester(index)
    }

    function getExtraActive(i, j) {
        return extraActive[i]?.[j] ?? true
    }

    function setExtraActive(i, j, value) {
        if (!extraActive[i]) extraActive[i] = new Array(cEvents[i]?.extraMeetings.length ?? 0).fill(true)
        extraActive[i][j] = value
    }

    $effect.pre(() => {
        const needButtonSync = buttonActive.length !== cEvents.length
        const needExtraSync = cEvents.some((course, i) =>
            (extraActive[i]?.length ?? 0) !== course.extraMeetings.length
        )
        if (needButtonSync || needExtraSync) {
            buttonActive = Array.from({ length: cEvents.length }, (_, i) => buttonActive[i] ?? true)
            extraActive = cEvents.map((course, i) =>
                Array.from({ length: course.extraMeetings.length }, (_, j) => extraActive[i]?.[j] ?? true)
            )
        }
    })
</script>

<div class="flexRow" style="margin: 5vh 0 1vh 0; justify-content: center">
    <ButtonGroup buttons={semesterButtons} bind:selected={() => Math.max(semesterIndex, 0), (index) => changeSemester(index)}/>
</div>
<div class="flexRow" style="margin-bottom: 5vh">
    <div id="classesHolder" class="surface-base">
            {#if cEvents.length > 0}
                {#each cEvents as item, i }
                    <div class="flexCol surface-1" style="align-items: flex-start; text-align: left; padding: 0.3vh 0.3vw 0.3vh 0.3vw;">
                        <div class="flexRowVariant headerRow">
                            <h1 class="title">{item.courseName}</h1>
                            <ToggleButton iconName='visibility' disabledIcon='visibility_off' activeClass={colors[i]} bind:active={buttonActive[i]}/>
                        </div>
                        <p><strong>{item.coursePrefix} {item.courseCode}</strong>.{item.sectionNumber}</p>
                        <p><strong>Hour Count: </strong> {item.hourCount}</p>
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
        <Calendar calendarEvents={cEvents} calendarID={calendarID} bind:timeScale eventVisibility={buttonActive} extraVisibility={extraActive} use24Hour={use24Hour} />
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