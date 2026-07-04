<script>
    let {cEvents = $bindable()} = $props()

    import IconButton from '$lib/components/IconButton.svelte'
    import { format12hrTime, formatDaysOfWeek, createCalendarObject, createExtraMeeting } from '$lib/index.js'
    import Dialog from '../lib/components/Dialog.svelte';
    import FAB from '../lib/components/FAB.svelte';
    import Icon from '../lib/components/Icon.svelte';
    
    let addDialogActive = $state(false)
    let protoCourse = $state(createCalendarObject())
    protoCourse.extraMeetings = new Array(1).fill(createExtraMeeting())

    function deleteEvent(index) {
        cEvents.splice(index,1)
    }

    function addEvent() {

    }
</script>

<FAB iconName="add" type="primary" disabled={addDialogActive} onClick={() => {addDialogActive = !addDialogActive}}/>
<div class="flexCol" style="margin: 5vh 0 5vh 0">
    <div id="classesHolder" class="surface-base">
        {#if cEvents.length > 0}
            {#each cEvents as item, i }
                <div class="flexCol surface-1" style="align-items: flex-start; text-align: left; padding: 0.3vh 0.3vw 0.3vh 0.3vw;">
                    <div class="flexRowVariant headerRow">
                        <h1 class="title">{item.coursePrefix} {item.courseCode}.<span style="font-size: 20px">{item.sectionNumber}</span></h1>
                        <IconButton name='delete' type='button-septenary' action={() => deleteEvent(i)}/>
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
</div>
<Dialog disabled={addDialogActive}>
    {#snippet content()}
        <form>
            <h2>Add Course</h2>
            <h3>Course Name</h3>
            <div class="flexRow">
                <input bind:value={protoCourse.coursePrefix} placeholder="Course Prefix" required>
                <input bind:value={protoCourse.courseCode} placeholder="Course Code" required>
                <input bind:value={protoCourse.sectionNumber} placeholder="Section Number" required>
            </div>
            <hr>
            <h3>Course Details</h3>
            <div class="flexRow" style="align-items: stretch;">
                <input bind:value={protoCourse.courseName}  placeholder="Course Name" required>
                <input bind:value={protoCourse.room}  placeholder="Course Location/Room" required>
            </div>
            <hr>
            <h3>Meeting Time</h3>
            <div class="flexRow" style="align-items: stretch;">
                <input bind:value={protoCourse.meetingTime[0]}  placeholder="Start Time" required>
                <input type="range">
                <input bind:value={protoCourse.meetingTime[1]} placeholder="End Time" required>
            </div>
            <hr>
            <h3>Meeting Days</h3>
            <div class="flexRow">
                <label for="monday">Monday:</label>
                <input type="checkbox">

                <label for="tuesday">Tuesday:</label>
                <input type="checkbox">

                <label for="wednesday">Wednesday:</label>
                <input type="checkbox">

                <label for="thursday">Thursday:</label>
                <input type="checkbox">

                <label for="friday">Friday:</label>
                <input type="checkbox">
            </div>
            <hr>
            <h3>Extra Meetings</h3>
            {#each protoCourse.extraMeetings as item, i}
                <div class="surface-3">
                    <h4>Meeting Details</h4>
                    <div class="flexRow">
                        <input placeholder="Meeting Type" required>
                        <input placeholder="Section Number" required>
                        <input placeholder="Meeting Location" required>
                    </div>
                    <hr>
                    <h4>Meeting Time</h4>
                    <div class="flexRow" style="align-items: stretch;">
                        <input placeholder="Start Time" required>
                        <input type="range">
                        <input placeholder="End Time" required>
                    </div>
                    <hr>
                    <h4>Meeting Days</h4>
                    <div class="flexRow">
                        <label for="monday">Monday:</label>
                        <input type="checkbox">

                        <label for="tuesday">Tuesday:</label>
                        <input type="checkbox">

                        <label for="wednesday">Wednesday:</label>
                        <input type="checkbox">

                        <label for="thursday">Thursday:</label>
                        <input type="checkbox">

                        <label for="friday">Friday:</label>
                        <input type="checkbox">
                    </div>
                    <div class="flexRow" style="align-items: right">
                        {#if i === protoCourse.extraMeetings.length-1}
                            <IconButton name="add" type="button-quaternary" />
                        {/if}
                        <IconButton name="delete" type="button-septenary"/>
                    </div>
                    
                </div>
            {/each}
        </form>
        

    {/snippet}
</Dialog>
<style lang="scss">
    @use '$lib/styles/variables' as *;


    #classesHolder {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;

        height: 40vw;
        width: 40vw;

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

    form {
        * {
            margin: 0.5vh 2px 0.5vh 2px;
        }
    }
</style>