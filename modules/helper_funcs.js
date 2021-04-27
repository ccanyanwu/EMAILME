module.exports = {

    //Convert time in string to time string
    convert_seconds_To_Time_String(seconds) {
        let min = Math.floor(seconds / 60)
        let sec = seconds % 60
        let timeString = min + ' min : ' + sec + ' sec'
        return timeString
    }
}