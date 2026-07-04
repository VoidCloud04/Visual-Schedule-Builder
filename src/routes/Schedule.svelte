<script>
    import Calendar from "$lib/components/Calendar.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import IconButton from "$lib/components/IconButton.svelte";
    import ToggleButton from "../lib/components/ToggleButton.svelte";
    import { format12hrTime } from '$lib/index.js'

    let cEvents = $state([1,2,3,4,5,6,7,8])
    let cID = $state('main')
    let timeScale = $state([8,23])
    const colors = ['button-primary','button-secondary','button-tertiary','button-quaternary',
    'button-quinary','button-senary','button-septenary','button-octonary'
    ]
    let buttonActive = $state(new Array(8).fill(true))
</script>

<h1>Hello From Schedule Builder</h1>
<div class="flexRow">
    <div id="classesHolder" class="surface-base">
        {#if cEvents.length > 0}
            {#each cEvents as item, i }
                <div class="flexCol surface-1" style="align-items: flex-start; text-align: left; padding: 0.3vh 0.3vw 0.3vh 0.3vw;">
                    <div class="flexRowVariant headerRow">
                        <h1 class="title">CSCE {1010 + (i * 10)}.<span style="font-size: 20px">101</span></h1>
                        <ToggleButton class="pushRight" iconName='visibility' disabledIcon='visibility_off' activeClass={colors[i]} bind:active={buttonActive[i]}/>
                    </div>
                    <p>Course Name | Room</p>
                    <p></p>
                </div>
            {/each}
        {:else}
            <h3>No Classes Displayed</h3>
        {/if}
    </div>
    <Calendar bind:calendarEvents={cEvents} bind:calendarID={cID} bind:timeScale />
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
        flex: 1; /* THIS is what pushes the button right */
        text-align: left; /* override your global center */
    }
</style>