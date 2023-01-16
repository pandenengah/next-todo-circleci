import moment from "moment";

export const pipeDate = (date: string): string => {
    if (date !== null && date !== '') {
        return moment(date).format('D MMM YYYY, h:mm A')
    }
    return ''
}

export const pipeDateToInputDateTime = (date: string): string => {
    if (date !== null && date !== '') {
        return moment(date).format('YYYY-MM-DDTHH:mm')
    }
    return ''
}
