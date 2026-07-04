<script>
    import { onMount } from "svelte";
    import { colors } from "$lib/styles/colors";

    let {calendarEvents = $bindable(), calendarID, timeScale = $bindable()} = $props()

    let canvas
    let context
    let canvasDimensions = {height: 0, width: 0}
    
    const days = [
        {name: "Monday"},
        {name: "Tuesday"},
        {name: "Wednesday"},
        {name: "Thursday"},
        {name: "Friday"}]
    // Rendering Code

    function renderGrid() {
        // Header
        context.fillStyle = colors.onSurface
        const headerPoint = canvasDimensions.height * 0.0725 // top sixteenth is header
        context.fillRect(0,headerPoint,canvasDimensions.width,2)
        // Time Legend Divider
        const legendPoint = canvasDimensions.width * 0.0725
        const fontSize = canvasDimensions.height * 0.0265
        context.font = `${fontSize}px Inter`
        context.textAlign = "center"
        context.textBaseline = "middle"
        // context.fillRect(0,0,legendPoint,headerPoint)
        // Vertical Dividers
        const vertDividerSpacing = (canvasDimensions.width - legendPoint) / days.length
        // Days of The Week Text
        for (let i = 0; i < days.length; i++) {
            const x = legendPoint + vertDividerSpacing * i + vertDividerSpacing / 2
            const y = headerPoint / 2
            context.fillStyle = colors.primary
            context.fillText(days[i].name, x, y)
        }
        // Horizontal Dividers
        const timeIntervalWidth = (timeScale[1] - timeScale[0])
        const horiDividerSpacing = (canvasDimensions.height - headerPoint) / (timeIntervalWidth * 2)
        const hourSpacing = horiDividerSpacing * 2
        console.log(`Time Intervals: ${timeScale[0]}-${timeScale[1]}=${timeIntervalWidth}`)
        console.log(`Divider Spacing (.5hr)/(1hr): ${horiDividerSpacing}/${hourSpacing}`)
        for(let i = 0; i < timeIntervalWidth * 2; i++) {
            // console.log(`${i} -> Horizontal Divider`)
            if(i % 2 != 0) { // Half Hour Mark
                context.fillStyle = colors.border
            } 
            else {
                context.fillStyle = colors.onSurface
            }
            context.fillRect(0,(headerPoint + (horiDividerSpacing * i)),canvasDimensions.width,2)
        }
        // Clear Time Legend Column
        context.fillStyle = colors.surface
        context.fillRect(0,0,legendPoint,canvasDimensions.height)
        context.fillStyle = colors.onSurface
        // Render Time Labels
        context.textAlign = "left"
        context.textBaseline = "bottom"
        for(let i = 0; i < timeIntervalWidth; i++) {
            const y = headerPoint + (hourSpacing * i) + fontSize * 0.5
            const time = (timeScale[0]) + i
            const timePrefix = time >= 12 ? "PM" : "AM"
            const timeFormatted = time > 12 ? time - 12 : time
            const colorFill = i % 2 == 0 ? colors.onSurface : colors.primary
            context.fillStyle = colorFill
            context.fillText(`${timeFormatted}:00`,2,y)
        }
        // Vertical Divider Lines
        context.fillRect(legendPoint,0,2,canvasDimensions.height)
        for(let i = 1; i <= days.length; i++) {
            context.fillRect((vertDividerSpacing * i) + legendPoint,0,2,canvasDimensions.height)
            // console.log(`${i} -> Divider`)
        }
    }

    function renderEvents() {

    }

    function renderCalendar() {
        renderGrid()
    }

    function resizeCanvas() {
        const {width, height} = canvas.getBoundingClientRect()
        canvasDimensions = {width, height}

        canvas.width = width
        canvas.height = height

        console.log(canvasDimensions)
    }

    onMount(() => {
        context = canvas.getContext("2d")

        resizeCanvas()
        renderCalendar()
    })

    $effect(() => {

    })
</script>

<canvas bind:this={canvas} id="calendar-{calendarID}">

</canvas>

<style lang="scss">
    @use '$lib/styles/variables' as *;

    canvas {
        height: 40vw;
        width: 40vw;

        border: 2px solid $surface;
        border-radius: 12px;

        background-color: $surface;
    }
</style>