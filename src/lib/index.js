export function createCalendarObject() {
    return {
        coursePrefix: "",
        courseCode: "",
        sectionNumber: "",
        courseName: "",
        room: "",
        meetingTime: [0, 2400],
        daysOfWeek: Array(5).fill(false),
        extraMeetings: []
    };
}

export function createExtraMeeting() {
    return {
        meetingType: "",
        sectionNumber: "",
        room: "",
        meetingTime: [0, 2400],
        daysOfWeek: Array(5).fill(false)
    };
}

export const DaysOfWeek = [
    {name: 'Monday', abbr: "M"},
    {name: 'Tuesday', abbr: "Tu"},
    {name: 'Wednesday', abbr: "W"},
    {name: 'Thursday', abbr: "Th"},
    {name: 'Friday', abbr: "F"}
]

/**
 * 
 * @param {Number} timeVal -
 * @example 0000 -> 2459
 */
export function format12hrTime(timeVal) {
    if (timeVal >= 2400) timeVal = timeVal - 2400
    const isPM = timeVal >= 1200
    
    let hours = Math.floor(timeVal / 100);
    const minutes = timeVal % 100

    if (hours === 0) {
        hours = 12
    } else if (hours > 12) {
        hours -= 12
    }

    const timePrefix = isPM ? 'PM' : 'AM'

    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes} ${timePrefix}`
}

export function formatDaysOfWeek(dowArr) {
    let dayArr = new Array()
    for(let i = 0; i < dowArr.length; i++) {
        if(dowArr[i]) {
            dayArr.push(DaysOfWeek[i].abbr)
        }
    }
    return dayArr.join(', ')
}

export function saveData(calendarEvents, visibilityArray) {
    window.localStorage.setItem('calendarEvents',btoa(JSON.stringify(calendarEvents)))
    window.localStorage.setItem('visibleItems',btoa(JSON.stringify(visibilityArray)))
}

export function saveVisibility(visibilityArray) {
    window.localStorage.setItem('visibleItems',btoa(JSON.stringify(visibilityArray)))
}

export function loadCalendarEvents() {
    const loadedData = window.localStorage.getItem('calendarEvents')
    if(loadedData === undefined || loadedData === null) {
        console.warn('No Calendar Events Available in Local Storage')
        return new Array()
    }
    return JSON.parse(atob(loadedData))
}

export function loadVisibleItems() {
    const loadedData = window.localStorage.getItem('visibleItems')
    if(loadedData === undefined || loadedData === null) {
        console.warn('No Visibility Data Available in Local Storage')
        return new Array(8).fill(true)
    }
    return JSON.parse(atob(loadedData))
}