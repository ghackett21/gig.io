/**
 * Get the current date and time in SQL accepted datetime format
 */
module.exports = function() {
	var today = new Date();
	var date = today.getUTCFullYear()+'-'+(today.getUTCMonth()+1)+'-'+today.getUTCDate();
	var time = today.getUTCHours() + ":" + today.getUTCMinutes() + ":" + today.getUTCSeconds();
	return date+' '+time;
}
