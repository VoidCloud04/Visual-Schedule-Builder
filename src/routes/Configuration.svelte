<script>
    let {cEvents = $bindable(), semesters = [], selectedSemester = $bindable(), switchSemester = () => {}, onCreateSemester = () => {}, onRenameSemester = () => {}, onDeleteSemester = () => {}, onDeleteCourse = () => {}, onDeleteExtra = () => {}} = $props()

    import IconButton from '$lib/components/IconButton.svelte'
    import { format12hrTime, formatDaysOfWeek, createCalendarObject, createExtraMeeting, timeConverter, timeToInput } from '$lib/index.js'
    import { onMount } from 'svelte';
    import { colorsArray } from '$lib/styles/colors';
    import Dialog from '../lib/components/Dialog.svelte';
    import FAB from '../lib/components/FAB.svelte';
    import ButtonGroup from '../lib/components/ButtonGroup.svelte';
    import { snackbar } from '../lib/components/scripts/snackbar.svelte';
    
    let addDialogActive = $state(false)
    let deleteEventActive = $state(false)
    let deleteExtraActive = $state(false)
    let editMode = $state(false)
    let editIndex = $state(0)
    let renameActive = $state(false)
    let renameIndex = $state(0)
    let renameInput = $state('')
    let createSemesterActive = $state(false)
    let createSemesterInput = $state('')
    let deleteSemesterActive = $state(false)
    let protoCourse = $state({...createCalendarObject(), extraMeetings: new Array(1).fill(createExtraMeeting())})
    let startTime = $state("00:00")
    let endTime = $state("12:00")
    let extraTimes = $state(new Array(1).fill(["00:00","12:00"]))
    let deleteIndex = $state(0)
    let deleteExtraCourseIndex = $state(0)
    let deleteExtraItemIndex = $state(0)

    let semesterButtons = $derived(semesters.map(semester => ({name: semester.name})))
    let semesterIndex = $derived(semesters.findIndex(semester => semester.id === selectedSemester))

    function changeSemester(index) {
        if(index >= 0 && index < semesters.length) switchSemester(index)
    }

    function startCreate() {
        editMode = false
        protoCourse = {...createCalendarObject(), extraMeetings: new Array(1).fill(createExtraMeeting())}
        startTime = "00:00"
        endTime = "12:00"
        extraTimes = new Array(1).fill(["00:00","12:00"])
        addDialogActive = true
    }

    function startEdit(index) {
        editMode = true
        editIndex = index
        protoCourse = structuredClone($state.snapshot(cEvents[index]))
        if(!protoCourse.online) {
            startTime = timeToInput(protoCourse.meetingTime[0])
            endTime = timeToInput(protoCourse.meetingTime[1])
        }
        extraTimes = protoCourse.extraMeetings.map(meeting => [timeToInput(meeting.meetingTime[0]), timeToInput(meeting.meetingTime[1])])
        addDialogActive = true
    }

    function deleteEvent(index) {
        cEvents.splice(index,1)
        onDeleteCourse(index)
    }

    function deleteExtraSection(courseIndex, itemIndex) {
        cEvents[courseIndex].extraMeetings.splice(itemIndex,1)
        onDeleteExtra(courseIndex, itemIndex)
    }

    function addEvent() {
        cEvents.push(structuredClone($state.snapshot(protoCourse)))
        protoCourse = {...createCalendarObject(), extraMeetings: new Array(1).fill(createExtraMeeting())}
        extraTimes = new Array(1).fill(["00:00","12:00"])
    }

    function deleteExtraMeeting(index) {
        protoCourse.extraMeetings.splice(index,1)
        extraTimes.splice(index,1)
    }

    function addExtraMeeting() {
        protoCourse.extraMeetings.push(createExtraMeeting())
        extraTimes.push(["00:00","12:00"])
    }

    function handleOnlineToggle(checked) {
        if (checked && protoCourse.extraMeetings.length > 0) {
            protoCourse.extraMeetings = []
            extraTimes = []
        }
    }

    function startCreateSemester() {
        if(semesters.length >= 4) {
            snackbar.show("You cannot have more than four semesters", "error")
            return
        }
        createSemesterInput = ''
        createSemesterActive = true
    }

    function confirmCreateSemester() {
        if(createSemesterInput.trim().length === 0) {
            snackbar.show("Semester name cannot be empty", "error")
            return
        }
        onCreateSemester(createSemesterInput.trim())
        createSemesterActive = false
    }

    function startRename(index) {
        renameIndex = index
        renameInput = semesters[index]?.name ?? ''
        renameActive = true
    }

    function confirmRename() {
        if(renameInput.trim().length === 0) {
            snackbar.show("Semester name cannot be empty", "error")
            return
        }
        onRenameSemester(renameInput.trim(), renameIndex)
        renameActive = false
    }

    function confirmDeleteSemester() {
        onDeleteSemester(semesterIndex)
        deleteSemesterActive = false
    }

    function validateEvent() {
        let foundDay = false

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

        if(!protoCourse.online && protoCourse.room.length === 0) {
            snackbar.show("Course is missing a room, ex: Wh 101", "error")
            return
        }

        if(!protoCourse.online) {
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
        }

        if(protoCourse.extraMeetings.length > 0 && !protoCourse.online) {
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

        if(protoCourse.online) {
            protoCourse.extraMeetings = []
            extraTimes = []
        }

        // This will only occur if all validations pass
        if(editMode) {
            cEvents[editIndex] = structuredClone($state.snapshot(protoCourse))
            editMode = false
            editIndex = 0
            addDialogActive = false
        }
        else {
            addEvent()
        }
    }

</script>

<FAB iconName="add" type="primary" disabled={addDialogActive || cEvents.length >= 8} onClick={startCreate}/>
<div class="flexCol" style="margin: 5vh 0 5vh 0">
    <div class="flexRowVariant semesterHeader">
        <ButtonGroup buttons={semesterButtons} bind:selected={() => Math.max(semesterIndex, 0), (index) => changeSemester(index)}/>
        <div class="flexRow">
            <IconButton name="add" title="Add Semester" type="button-primary" disabled={semesters.length >= 4} onClick={startCreateSemester}/>
            <IconButton name="edit" title="Rename Semester" type="button-tertiary" disabled={semesters.length === 0} onClick={() => {startRename(Math.max(semesterIndex, 0))}}/>
            <IconButton name="delete" title="Delete Semester" type="button-septenary" disabled={semesters.length <= 1} onClick={() => {deleteSemesterActive = true}}/>
        </div>
    </div>
    <div id="classesHolder" class="surface-base">
        {#if cEvents.length > 0}
            {#each cEvents as item, i }
                <div class="flexCol surface-1" style="align-items: flex-start; text-align: left; padding: 0.3vh 0.3vw 0.3vh 0.3vw;">
                    <div class="flexRowVariant headerRow">
                        <h1 class="title">{item.courseName}</h1>
                        <IconButton name='edit' title="Edit Course" type='button-tertiary' onClick={() => {startEdit(i)}}/>
                        <IconButton name='delete' type='button-septenary' onClick={() => {deleteEventActive = true; deleteIndex = i}}/>
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
                                <IconButton name='delete' type='button-septenary' onClick={() => {deleteExtraActive = true; deleteExtraCourseIndex = i; deleteExtraItemIndex = j}}/>
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
</div>
<Dialog disabled={addDialogActive}>
    {#snippet content()}
        <form>
            <h2>{editMode ? 'Edit Course' : 'Add Course'}</h2>
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
                <label for="online">Online Course:</label>
                <input id="online" bind:checked={protoCourse.online} type="checkbox" onchange={(event) => handleOnlineToggle(event.currentTarget.checked)}>
                {#if !protoCourse.online}
                    <input bind:value={protoCourse.room}  placeholder="Course Location/Room" required>
                {/if}
            <div class="formRow">

            </div>
            {#if !protoCourse.online}
            <hr>
            <h3>Meeting Time</h3>
                <label for="courseStart">Start Time:</label>
                <input id="courseStart" bind:value={startTime} type="time" required>
                <label for="courseEnd">End Time:</label>
                <input id="courseEnd" bind:value={endTime} type="time" required>
            <hr>
            <h3>Meeting Days</h3>
                <label for="courseMonday">Monday:</label>
                <input id="courseMonday" bind:checked={protoCourse.daysOfWeek[0]} type="checkbox">

                <label for="courseTuesday">Tuesday:</label>
                <input id="courseTuesday" bind:checked={protoCourse.daysOfWeek[1]} type="checkbox">

                <label for="courseWednesday">Wednesday:</label>
                <input id="courseWednesday" bind:checked={protoCourse.daysOfWeek[2]} type="checkbox">

                <label for="courseThursday">Thursday:</label>
                <input id="courseThursday" bind:checked={protoCourse.daysOfWeek[3]} type="checkbox">

                <label for="courseFriday">Friday:</label>
                <input id="courseFriday" bind:checked={protoCourse.daysOfWeek[4]} type="checkbox">
            <hr>
            <h3>Extra Meetings</h3>
            {/if}
            {#if protoCourse.extraMeetings.length === 0 && !protoCourse.online}
                <div class="buttonRow">
                    <IconButton name="add" type="button-primary" onClick={() => {addExtraMeeting()}} style="margin-right: 8px"/>
                </div>
            {/if}
            {#if !protoCourse.online}
                {#each protoCourse.extraMeetings as item, i}
                <div class="surface-3">
                    <h4>Meeting Details</h4>
                        <input bind:value={item.meetingType} placeholder="Meeting Type" required>
                        <input bind:value={item.sectionNumber} placeholder="Section Number" required>
                        <input bind:value={item.room} placeholder="Meeting Location/Room" required>
                    <hr>
                    <h4>Meeting Time</h4>
                        <label for={`extraStart-${i}`}>Start Time:</label>
                        <input id={`extraStart-${i}`} bind:value={extraTimes[i][0]} type="time" required>
                        <label for={`extraEnd-${i}`}>End Time:</label>
                        <input id={`extraEnd-${i}`} bind:value={extraTimes[i][1]} type="time" required>
                    <hr>
                    <h4>Meeting Days</h4>
                        <label for={`extraMonday-${i}`}>Monday:</label>
                        <input id={`extraMonday-${i}`} bind:checked={item.daysOfWeek[0]} type="checkbox">

                        <label for={`extraTuesday-${i}`}>Tuesday:</label>
                        <input id={`extraTuesday-${i}`} bind:checked={item.daysOfWeek[1]} type="checkbox">

                        <label for={`extraWednesday-${i}`}>Wednesday:</label>
                        <input id={`extraWednesday-${i}`} bind:checked={item.daysOfWeek[2]} type="checkbox">

                        <label for={`extraThursday-${i}`}>Thursday:</label>
                        <input id={`extraThursday-${i}`} bind:checked={item.daysOfWeek[3]} type="checkbox">

                        <label for={`extraFriday-${i}`}>Friday:</label>
                        <input id={`extraFriday-${i}`} bind:checked={item.daysOfWeek[4]} type="checkbox">
                    <div class="buttonRow">
                        {#if i === protoCourse.extraMeetings.length-1}
                            <IconButton name="add" title="Add Extra Meeting" type="button-primary" onClick={() => {addExtraMeeting()}}/>
                        {/if}
                        <IconButton name="delete" title="Delete Extra Meeting {i+1}" type="button-septenary" onClick={() => {deleteExtraMeeting(i)}}/>
                    </div>
                </div>
            {/each}
            {/if}
            <div class="buttonRow">
                <button title="Course Submission Button" type="button" onclick={() => {validateEvent()}} class="button-primary">{editMode ? 'Save Changes' : 'Add Course'}</button>
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
                <button class="button-primary" onclick={() => {deleteEvent(deleteIndex); deleteEventActive = false; deleteIndex = 0}}>Yes</button>
                <button class="button-septenary" onclick={() => {deleteEventActive = false; deleteIndex = 0}}>No</button>
            </div>
        {/if}
    {/snippet}
</Dialog>

<Dialog disabled={deleteExtraActive}>
    {#snippet content()}
        {#if cEvents[deleteExtraCourseIndex]?.extraMeetings[deleteExtraItemIndex]}
            <h1>Are you sure?</h1>
            <p>This will permanently delete {cEvents[deleteExtraCourseIndex].extraMeetings[deleteExtraItemIndex].meetingType} {cEvents[deleteExtraCourseIndex].extraMeetings[deleteExtraItemIndex].sectionNumber}</p>
            <div class="buttonRow">
                <button class="button-primary" onclick={() => {deleteExtraSection(deleteExtraCourseIndex, deleteExtraItemIndex); deleteExtraActive = false; deleteExtraCourseIndex = 0; deleteExtraItemIndex = 0}}>Yes</button>
                <button class="button-septenary" onclick={() => {deleteExtraActive = false; deleteExtraCourseIndex = 0; deleteExtraItemIndex = 0}}>No</button>
            </div>
        {/if}
    {/snippet}
</Dialog>

<Dialog disabled={createSemesterActive}>
    {#snippet content()}
        <form>
            <h1>New Semester</h1>
            <input bind:value={createSemesterInput} placeholder="Semester Name" required>
            <div class="buttonRow">
                <button class="button-primary" title="Create Semester Button" type="button" onclick={() => {confirmCreateSemester()}}>Create</button>
                <button class="button-septenary" title="Cancel Create Button" type="button" onclick={() => {createSemesterActive = false}}>Cancel</button>
            </div>
        </form>
    {/snippet}
</Dialog>

<Dialog disabled={renameActive}>
    {#snippet content()}
        <form>
            <h1>Rename Semester</h1>
            <input bind:value={renameInput} placeholder="Semester Name" required>
            <div class="buttonRow">
                <button class="button-primary" title="Rename Semester Button" type="button" onclick={() => {confirmRename()}}>Rename</button>
                <button class="button-septenary" title="Cancel Rename Button" type="button" onclick={() => {renameActive = false}}>Cancel</button>
            </div>
        </form>
    {/snippet}
</Dialog>

<Dialog disabled={deleteSemesterActive}>
    {#snippet content()}
        {#if semesters[semesterIndex]}
            <h1>Are you sure?</h1>
            <p>This will permanently delete {semesters[semesterIndex].name} and all of its classes.</p>
            <div class="buttonRow">
                <button class="button-primary" onclick={() => {confirmDeleteSemester()}}>Yes</button>
                <button class="button-septenary" onclick={() => {deleteSemesterActive = false}}>No</button>
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

    .semesterHeader {
        width: 40vw;
        margin-bottom: 1vh;
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