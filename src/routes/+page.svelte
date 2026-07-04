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

    let cEvents = $state([
        {
            coursePrefix: "CSCE",
            courseCode: "4450",
            sectionNumber: "123",
            courseName: "Senior Capstone I",
            room: "DP F214",
            meetingTime: [1200,1420],
            daysOfWeek: [true,false,true,false,false],
            extraMeetings: [
                {
                    meetingType: "REC",
                    sectionNumber: "124",
                    room: "DP E116",
                    meetingTime: [1200,1500],
                    daysOfWeek: [false,false,false,false,true]
                },
                {
                    meetingType: "LAB",
                    sectionNumber: "125",
                    room: "DP E117",
                    meetingTime: [1900,2200],
                    daysOfWeek: [false,true,false,false,false]
                },
            ],
        },
        {
            coursePrefix: "CSCE",
            courseCode: "4460",
            sectionNumber: "123",
            courseName: "Senior Capstone II",
            room: "DP F214",
            meetingTime: [800,1220],
            daysOfWeek: [false,true,false,true,false],
            extraMeetings: new Array(),
        },
                {
            coursePrefix: "MATH",
            courseCode: "3720",
            sectionNumber: "405",
            courseName: "Linear Algebra",
            room: "Wh 104",
            meetingTime: [1300,1500],
            daysOfWeek: [false,true,false,true,false],
            extraMeetings: new Array(),
        }
    ])
</script>

<Header />
<ButtonGroup buttons={mainTabs} bind:selected={selectedMainTab} />
{#if selectedMainTab === 0}
    <Schedule cEvents={cEvents} />
{:else if selectedMainTab === 1}
    <Configuration bind:cEvents={cEvents} />
{:else if selectedMainTab === 2}
    <Documentation />
{:else if selectedMainTab === 3}
    <Credits />
{:else}
    <h1>Invalid Tab</h1>
{/if}


