/** 
 * 
*/
export const CalendarObject = {
    coursePrefix: "",
    courseCode: "",
    sectionNumber: "",
    courseName: "",
    room: "",
    meetingTime: new Array(2),
    daysOfWeek: new Array(5),
    extraMeetings: new Array(),
}

export const ExtraMeeting = {
    meetingType: "",
    sectionNumber: "",
    room: "",
    meetingTime: new Array(2),
    daysOfWeek: new Array(5)
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

export function saveData(calendarEvents, visibility) {
    window.localStorage.setItem('calendarEvents',atob(JSON.stringify(calendarEvents)))
    window.localStorage.setItem('visibleItems',atob(JSON.stringify(visibility)))
}

export function loadCalendarEvents() {
    const loadedData = window.localStorage.getItem('calendarEvents')
    if(loadedData === undefined || loadedData === null) {
        console.warn('No Calendar Events Available in Local Storage')
        return new Array()
    }
    return JSON.parse(btoa(loadedData))
}

export function loadVisibleItems() {
    const loadedData = window.localStorage.getItem('visibleItems')
    if(loadedData === undefined || loadedData === null) {
        console.warn('No Visibility Data Available in Local Storage')
        return new Array(8).fill(true)
    }
    return JSON.parse(btoa(loadedData))
}