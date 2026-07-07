<script>
    let {cEvents = $bindable()} = $props()

    import IconButton from '$lib/components/IconButton.svelte'
    import { format12hrTime, formatDaysOfWeek, createCalendarObject, createExtraMeeting, timeConverter, saveCalendarEvents } from '$lib/index.js'
    import { onMount } from 'svelte';
    import Dialog from '../lib/components/Dialog.svelte';
    import FAB from '../lib/components/FAB.svelte';
    import { snackbar } from '../lib/components/scripts/snackbar.svelte';
    
    let addDialogActive = $state(false)
    let deleteEventActive = $state(false)
    let protoCourse = $state({...createCalendarObject(), extraMeetings: new Array(1).fill(createExtraMeeting())})
    let startTime = $state("00:00")
    let endTime = $state("12:00")
    let extraTimes = $state(new Array(1).fill(["00:00","12:00"]))
    let deleteIndex = $state(0)

    function deleteEvent(index) {
        cEvents.splice(index,1)
        saveCalendarEvents(cEvents)
    }

    function addEvent() {
        cEvents.push(structuredClone($state.snapshot(protoCourse)))
        console.log($state.snapshot(protoCourse))
        protoCourse = {...createCalendarObject(), extraMeetings: new Array(1).fill(createExtraMeeting())}
        extraTimes = new Array(1).fill(["00:00","12:00"])

        saveCalendarEvents(cEvents)
    }

    function deleteExtraMeeting(index) {
        protoCourse.extraMeetings.splice(index,1)
        extraTimes.splice(index,1)
    }

    function addExtraMeeting() {
        protoCourse.extraMeetings.push(createExtraMeeting())
        extraTimes.push(["00:00","12:00"])
    }

    function validateEvent() {
        if(protoCourse.coursePrefix.length === 0) {
            snackbar.show("Course is missing a prefix, ex: CSCE", "error")
            return
        }

        if(protoCourse.courseCode.length === 0) {
            snackbar.show("Course is missing a code, ex: 1030", "error")
            return
        }

        if(protoCourse.sectionNumber.length === 0) {
            snackbar.show("Course is missing a section number, ex: 402", "error")
            return
        }

        if(protoCourse.courseName.length === 0) {
            snackbar.show("Course is missing a name, ex: Computer Science I", "error")
            return
        }

        if(protoCourse.room.length === 0) {
            snackbar.show("Course is missing a room, ex: Wh 101", "error")
            return
        }

        const courseStart = timeConverter(startTime)
        const courseEnd = timeConverter(endTime)
        
        if(courseStart >= courseEnd) {
            snackbar.show("Course cannot start when or after it is supposed to end", "error")
            return
        }
        else {
            protoCourse.meetingTime[0] = courseStart
            protoCourse.meetingTime[1] = courseEnd
        }

        let foundDay = false

        for(let i = 0; i < protoCourse.daysOfWeek.length; i++) {
            if(protoCourse.daysOfWeek[i] === true) {
                foundDay = true
                break
            }
        }

        if(!foundDay) {
            snackbar.show("Course has to at least take place one day a week", "error")
            return
        }

        if(protoCourse.extraMeetings.length > 0) {
            for (let i = 0; i < protoCourse.extraMeetings.length; i++) {
                const item = protoCourse.extraMeetings[i]

                if (item.meetingType.length === 0) {
                    snackbar.show(`Meeting ${i + 1} is missing a meeting type`, "error")
                    return
                }

                if (item.sectionNumber.length === 0) {
                    snackbar.show(`Meeting ${i + 1} is missing a section number`, "error")
                    return
                }

                const meetingStart = timeConverter(extraTimes[i][0])
                const meetingEnd = timeConverter(extraTimes[i][1])

                if (meetingStart >= meetingEnd) {
                    snackbar.show(`Meeting ${i + 1} cannot start when or after it is supposed to end`, "error")
                    return
                }
                else {
                    protoCourse.extraMeetings[i].meetingTime[0] = meetingStart
                    protoCourse.extraMeetings[i].meetingTime[1] = meetingEnd
                }

                foundDay = false

                for (let j = 0; j < item.daysOfWeek.length; j++) {
                    if (item.daysOfWeek[j]) {
                        foundDay = true
                        break
                    }
                }

                if (!foundDay) {
                    snackbar.show(`Meeting ${i + 1} has to at least take place one day a week`, "error")
                    return
                }
            }
        }

        // This will only occur if all validations pass
        addEvent()
    }

</script>

<FAB iconName="add" type="primary" disabled={addDialogActive || cEvents.length >= 8} onClick={() => {addDialogActive = !addDialogActive}}/>
<div class="flexCol" style="margin: 5vh 0 5vh 0">
    <div id="classesHolder" class="surface-base">
        {#if cEvents.length > 0}
            {#each cEvents as item, i }
                <div class="flexCol surface-1" style="align-items: flex-start; text-align: left; padding: 0.3vh 0.3vw 0.3vh 0.3vw;">
                    <div class="flexRowVariant headerRow">
                        <h1 class="title">{item.coursePrefix} {item.courseCode}.<span style="font-size: 20px">{item.sectionNumber}</span></h1>
                        <IconButton name='delete' type='button-septenary' onClick={() => {deleteEventActive = true; deleteIndex = i}}/>
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
            <hr>
            <h3>Course Name</h3>
                <input bind:value={protoCourse.coursePrefix} placeholder="Course Prefix" required>
                <input bind:value={protoCourse.courseCode} placeholder="Course Code" required>
                <input bind:value={protoCourse.sectionNumber} placeholder="Section Number" required>
            <div class="formRow">

            </div>
            <hr>
            <h3>Course Details</h3>
                <input bind:value={protoCourse.courseName}  placeholder="Course Name" required>
                <input bind:value={protoCourse.room}  placeholder="Course Location/Room" required>
            <div class="formRow">

            </div>
            <hr>
            <h3>Meeting Time</h3>
                <label for="start">Start Time:</label>
                <input bind:value={startTime} type="time" required>
                <label for="end">End Time:</label>
                <input bind:value={endTime} type="time" required>
            <hr>
            <h3>Meeting Days</h3>
                <label for="monday">Monday:</label>
                <input bind:checked={protoCourse.daysOfWeek[0]} type="checkbox">

                <label for="tuesday">Tuesday:</label>
                <input bind:checked={protoCourse.daysOfWeek[1]} type="checkbox">

                <label for="wednesday">Wednesday:</label>
                <input bind:checked={protoCourse.daysOfWeek[2]} type="checkbox">

                <label for="thursday">Thursday:</label>
                <input bind:checked={protoCourse.daysOfWeek[3]} type="checkbox">

                <label for="friday">Friday:</label>
                <input bind:checked={protoCourse.daysOfWeek[4]} type="checkbox">
            <hr>
            <h3>Extra Meetings</h3>
            {#if protoCourse.extraMeetings.length === 0}
                <div class="buttonRow">
                    <IconButton name="add" type="button-quaternary" onClick={() => {addExtraMeeting()}} style="margin-right: 8px"/>
                </div>
            {/if}
            {#each protoCourse.extraMeetings as item, i}
                <div class="surface-3">
                    <h4>Meeting Details</h4>
                        <input bind:value={item.meetingType} placeholder="Meeting Type" required>
                        <input bind:value={item.sectionNumber} placeholder="Section Number" required>
                        <input bind:value={item.room} placeholder="Meeting Location/Room" required>
                    <hr>
                    <h4>Meeting Time</h4>
                        <label for="start">Start Time:</label>
                        <input bind:value={extraTimes[i][0]} type="time" required>
                        <label for="end">End Time:</label>
                        <input bind:value={extraTimes[i][1]} type="time" required>
                    <hr>
                    <h4>Meeting Days</h4>
                        <label for="monday">Monday:</label>
                        <input bind:checked={item.daysOfWeek[0]} type="checkbox">

                        <label for="tuesday">Tuesday:</label>
                        <input bind:checked={item.daysOfWeek[1]} type="checkbox">

                        <label for="wednesday">Wednesday:</label>
                        <input bind:checked={item.daysOfWeek[2]} type="checkbox">

                        <label for="thursday">Thursday:</label>
                        <input bind:checked={item.daysOfWeek[3]} type="checkbox">

                        <label for="friday">Friday:</label>
                        <input bind:checked={item.daysOfWeek[4]} type="checkbox">
                    <div class="buttonRow">
                        {#if i === protoCourse.extraMeetings.length-1}
                            <IconButton name="add" title="Add Extra Meeting" type="button-quaternary" onClick={() => {addExtraMeeting()}}/>
                        {/if}
                        <IconButton name="delete" title="Delete Extra Meeting {i+1}" type="button-septenary" onClick={() => {deleteExtraMeeting(i)}}/>
                    </div>
                </div>
            {/each}
            <div class="buttonRow">
                <button title="Course Submission Button" type="button" onclick={() => {validateEvent()}} class="button-quaternary">Add Course</button>
                <button title="Dialog Close Button" type="button" onclick={() => {addDialogActive = !addDialogActive}} class="button-septenary">Cancel</button>
            </div>
        </form>
    {/snippet}
</Dialog>

<Dialog disabled={deleteEventActive}>
    {#snippet content()}
        {#if cEvents.length > 0}
            <h1>Are you sure?</h1>
            <p>This will permanently delete {cEvents[deleteIndex].courseCode} {cEvents[deleteIndex].coursePrefix}</p>
            <div class="buttonRow">
                <button class="button-quaternary" onclick={() => {deleteEvent(deleteIndex); deleteEventActive = false; deleteIndex = 0}}>Yes</button>
                <button class="button-septenary" onclick={() => {deleteEventActive = false; deleteIndex = 0}}>No</button>
            </div>
        {/if}
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

    .buttonRow {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        gap: 0.5vw;
        margin-right: 8px;
    }
</style>