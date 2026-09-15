<script>
    import Header from "./Header.svelte";
    import Configuration from "./Configuration.svelte";
    import Schedule from "./Schedule.svelte";
    import ButtonGroup from "$lib/components/ButtonGroup.svelte";
    import Credits from "./Credits.svelte";
    import Snackbar from "../lib/components/Snackbar.svelte";
    import { onMount } from "svelte";
    import { loadCalendarEvents, createSemester, saveSemesters, loadSemesters, saveSemesterClasses, loadSemesterClasses, deleteSemester, load24HourSetting, save24HourSetting, saveVisibility, loadVisibleItems, saveExtraVisibility, loadExtraVisibility } from '$lib/index.js'
    import Settings from "./Settings.svelte";

    const mainTabs = [
        {name: 'Schedule Viewer'},
        {name: 'Course Configuration'},
        {name: 'Settings'},
        {name: 'Credits'}
    ]

    let selectedMainTab = $state(0)

    let cEvents = $state([])
    let semesters = $state([])
    let selectedSemesterId = $state('')
    let use24Hour = $state(false)
    let buttonActive = $state([])
    let extraActive = $state([])

    function switchSemester(index) {
        if(!semesters[index]) return
        selectedSemesterId = semesters[index].id
        cEvents = loadSemesterClasses(selectedSemesterId)
        buttonActive = loadVisibleItems(selectedSemesterId)
        extraActive = loadExtraVisibility(selectedSemesterId)
    }

    function createSemesterEntry(name) {
        if(semesters.length >= 4) return
        const newSemester = createSemester(name)
        semesters.push(newSemester)
        switchSemester(semesters.indexOf(newSemester))
    }

    function renameSemester(name, index) {
        if(!semesters[index]) return
        semesters[index].name = name
    }

    function removeSemester(index) {
        if(semesters.length <= 1 || !semesters[index]) return
        deleteSemester(semesters[index].id)
        semesters.splice(index, 1)
        switchSemester(Math.min(index, semesters.length - 1))
    }

    onMount(() => {
        const loaded = loadSemesters()
        if(loaded && loaded.semesters.length > 0) {
            semesters = loaded.semesters
            selectedSemesterId = loaded.selectedId
            if(!semesters.some(semester => semester.id === selectedSemesterId)) {
                selectedSemesterId = semesters[0].id
            }
        }
        else {
            const defaultSemester = createSemester('Semester 1')
            semesters = [defaultSemester]
            selectedSemesterId = defaultSemester.id
            saveSemesterClasses(selectedSemesterId, loadCalendarEvents())
            window.localStorage.removeItem('calendarEvents')
        }
        cEvents = loadSemesterClasses(selectedSemesterId)
        buttonActive = loadVisibleItems(selectedSemesterId)
        extraActive = loadExtraVisibility(selectedSemesterId)
        if(buttonActive.length === 0 && window.localStorage.getItem('visibleItems') !== null) {
            buttonActive = loadDataFromLegacyKey('visibleItems')
            window.localStorage.removeItem('visibleItems')
        }
        if(extraActive.length === 0 && window.localStorage.getItem('extraVisibleItems') !== null) {
            extraActive = loadDataFromLegacyKey('extraVisibleItems')
            window.localStorage.removeItem('extraVisibleItems')
        }
        use24Hour = load24HourSetting()
    })

    function loadDataFromLegacyKey(key) {
        const raw = window.localStorage.getItem(key)
        try {
            return JSON.parse(atob(raw))
        }
        catch {
            return new Array()
        }
    }

    function deleteCourseVisibility(index) {
        buttonActive?.splice(index, 1)
        extraActive?.splice(index, 1)
    }

    function deleteExtraVisibility(courseIndex, itemIndex) {
        extraActive?.[courseIndex]?.splice(itemIndex, 1)
    }

    $effect(() => {
        if(selectedSemesterId === '') return
        saveSemesters(semesters, selectedSemesterId)
        saveSemesterClasses(selectedSemesterId, cEvents)
    })

    $effect(() => {
        if(selectedSemesterId === '') return
        saveVisibility(selectedSemesterId, buttonActive)
        saveExtraVisibility(selectedSemesterId, extraActive)
    })

    $effect(() => {
        save24HourSetting(use24Hour)
    })
</script>

<Header />
<ButtonGroup buttons={mainTabs} bind:selected={selectedMainTab} />
{#if selectedMainTab === 0}
    <Schedule cEvents={cEvents} semesters={semesters} bind:selectedSemester={selectedSemesterId} switchSemester={switchSemester} use24Hour={use24Hour} bind:buttonActive={buttonActive} bind:extraActive={extraActive} />
{:else if selectedMainTab === 1}
    <Configuration bind:cEvents={cEvents} semesters={semesters} bind:selectedSemester={selectedSemesterId} switchSemester={switchSemester} onCreateSemester={createSemesterEntry} onRenameSemester={renameSemester} onDeleteSemester={removeSemester} onDeleteCourse={deleteCourseVisibility} onDeleteExtra={deleteExtraVisibility} />
{:else if selectedMainTab === 2}
    <Settings bind:use24Hour={use24Hour} />
{:else if selectedMainTab === 3}
    <Credits />
{:else}
    <h1>Invalid Tab</h1>
{/if}

<Snackbar />