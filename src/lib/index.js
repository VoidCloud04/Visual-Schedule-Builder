export function createCalendarObject() {
    return {
        coursePrefix: "",
        courseCode: "",
        sectionNumber: "",
        courseName: "",
        room: "",
        online: false,
        meetingTime: [0, 2400],
        daysOfWeek: Array(5).fill(false),
        extraMeetings: [],
        hourCount: 0,
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

export function timeConverter(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number)

    return hours * 100 + minutes
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

export function encodeData(data) {
    const json = JSON.stringify(data)
    const bytes = new TextEncoder().encode(json)
    let binary = ''
    for (const byte of bytes) binary += String.fromCharCode(byte)
    return btoa(binary)
}

export function decodeData(encoded) {
    const binary = atob(encoded)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return JSON.parse(new TextDecoder().decode(bytes))
}

export function saveData(calendarEvents, visibilityArray) {
    window.localStorage.setItem('calendarEvents',encodeData(calendarEvents))
    window.localStorage.setItem('visibleItems',encodeData(visibilityArray))
}

export function saveVisibility(semesterId, visibilityArray) {
    window.localStorage.setItem(`visibleItems-${semesterId}`, encodeData(visibilityArray))
}

export function saveExtraVisibility(semesterId, extraVisibilityArray) {
    window.localStorage.setItem(`extraVisibleItems-${semesterId}`, encodeData(extraVisibilityArray))
}

export function loadExtraVisibility(semesterId) {
    const loadedData = window.localStorage.getItem(`extraVisibleItems-${semesterId}`)
    if(loadedData === undefined || loadedData === null) {
        console.warn('No Extra Visibility Data Available in Local Storage')
        return new Array()
    }
    return decodeData(loadedData)
}

export function saveCalendarEvents(calendarEvents) {
    window.localStorage.setItem('calendarEvents',encodeData(calendarEvents))
}

export function loadCalendarEvents() {
    const loadedData = window.localStorage.getItem('calendarEvents')
    if(loadedData === undefined || loadedData === null) {
        console.warn('No Calendar Events Available in Local Storage')
        return new Array()
    }
    return decodeData(loadedData)
}

export function loadVisibleItems(semesterId) {
    const loadedData = window.localStorage.getItem(`visibleItems-${semesterId}`)
    if(loadedData === undefined || loadedData === null) {
        console.warn('No Visibility Data Available in Local Storage')
        return new Array()
    }
    return decodeData(loadedData)
}

export function createSemester(name) {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
    return {id, name}
}

export function saveSemesters(semesters, selectedId) {
    window.localStorage.setItem('semesterList', encodeData({semesters, selectedId}))
}

export function loadSemesters() {
    const loadedData = window.localStorage.getItem('semesterList')
    if(loadedData === undefined || loadedData === null) {
        console.warn('No Semester Data Available in Local Storage')
        return null
    }
    return decodeData(loadedData)
}

export function saveSemesterClasses(semesterId, classes) {
    window.localStorage.setItem(`semester-${semesterId}`, encodeData(classes))
}

export function loadSemesterClasses(semesterId) {
    const loadedData = window.localStorage.getItem(`semester-${semesterId}`)
    if(loadedData === undefined || loadedData === null) {
        console.warn(`No Calendar Events Available for Semester ${semesterId}`)
        return new Array()
    }
    return decodeData(loadedData)
}

export function deleteSemester(semesterId) {
    window.localStorage.removeItem(`semester-${semesterId}`)
}

export function timeToInput(timeVal) {
    const hours = Math.floor(timeVal / 100).toString().padStart(2, '0')
    const minutes = (timeVal % 100).toString().padStart(2, '0')
    return `${hours}:${minutes}`
}

export function save24HourSetting(value) {
    window.localStorage.setItem('use24Hour', encodeData(value))
}

export function load24HourSetting() {
    const loadedData = window.localStorage.getItem('use24Hour')
    if(loadedData === undefined || loadedData === null) {
        console.warn('No 24 Hour Setting Available in Local Storage')
        return false
    }
    return decodeData(loadedData)
}