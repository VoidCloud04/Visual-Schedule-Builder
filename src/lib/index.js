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
    const hourTotal = 0
    return {id, name, hourTotal}
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

export function timeToMinutes(t) {
    return Math.floor(t / 100) * 60 + (t % 100)
}

export function findCourseConflicts(cEvents, minGapMinutes = 10) {
    const slots = []
    for (let i = 0; i < cEvents.length; i++) {
        const course = cEvents[i]
        if (course.online) continue
        slots.push({
            courseIndex: i,
            meetingTime: course.meetingTime,
            daysOfWeek: course.daysOfWeek
        })
        for (const extra of course.extraMeetings ?? []) {
            slots.push({
                courseIndex: i,
                meetingTime: extra.meetingTime,
                daysOfWeek: extra.daysOfWeek
            })
        }
    }

    const boxes = []
    const pairSet = new Set()

    function addBox(a, b, day, start, end) {
        boxes.push({a, b, day, start, end})
        const key = a < b ? `${a}-${b}` : `${b}-${a}`
        pairSet.add(key)
    }

    for (let x = 0; x < slots.length; x++) {
        for (let y = x + 1; y < slots.length; y++) {
            const slotA = slots[x]
            const slotB = slots[y]
            if (slotA.courseIndex === slotB.courseIndex) continue

            const sharedDays = []
            for (let day = 0; day < slotA.daysOfWeek.length; day++) {
                if (slotA.daysOfWeek[day] && slotB.daysOfWeek[day]) {
                    sharedDays.push(day)
                }
            }
            if (sharedDays.length === 0) continue

            const startA = slotA.meetingTime[0]
            const endA = slotA.meetingTime[1]
            const startB = slotB.meetingTime[0]
            const endB = slotB.meetingTime[1]

            const dist = Math.max(
                0,
                timeToMinutes(startA) - timeToMinutes(endB),
                timeToMinutes(startB) - timeToMinutes(endA)
            )
            if (dist >= minGapMinutes) continue

            let boxStart, boxEnd
            if (Math.max(startA, startB) < Math.min(endA, endB)) {
                boxStart = Math.max(startA, startB)
                boxEnd = Math.min(endA, endB)
            }
            else {
                boxStart = toHHMM(timeToMinutes(Math.min(endA, endB)) - 5)
                boxEnd = toHHMM(timeToMinutes(Math.max(startA, startB)) + 5)
            }

            for (const day of sharedDays) {
                addBox(slotA.courseIndex, slotB.courseIndex, day, boxStart, boxEnd)
            }
        }
    }

    const byCourse = cEvents.map(() => [])
    for (const key of pairSet) {
        const [a, b] = key.split('-').map(Number)
        byCourse[a].push(b)
        byCourse[b].push(a)
    }
    byCourse.forEach(list => list.sort((p, q) => p - q))

    return { byCourse, boxes }
}

function toHHMM(minutes) {
    if (minutes < 0) minutes = 0
    else if (minutes >= 1440) minutes = 1439
    return Math.floor(minutes / 60) * 100 + (minutes % 60)
}

export function saveConflictGapSetting(value) {
    window.localStorage.setItem('conflictGap', encodeData(value))
}

export function loadConflictGapSetting() {
    const loadedData = window.localStorage.getItem('conflictGap')
    if(loadedData === undefined || loadedData === null) {
        console.warn('No Conflict Gap Setting Available in Local Storage')
        return 10
    }
    const value = decodeData(loadedData)
    if (typeof value !== 'number' || isNaN(value)) return 10
    return value
}