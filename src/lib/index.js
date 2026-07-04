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
    extraMeetings: new Array()
}

export const ExtraMeeting = {
    meetingType: "",
    sectionNumber: "",
    room: "",
    meetingTime: new Array(2),
    daysOfWeek: new Array(5)
}

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