import moment from "moment";
import "moment-timezone";

export default {
	formatMonthStartDate(timezone) {
		const momentObj = timezone ? moment().tz(timezone) : moment();
		return momentObj.startOf("month").format("YYYY-MM-DD");
	},
	formatNextMonthStartDate(timezone) {
		const momentObj = timezone ? moment().tz(timezone) : moment();
		return momentObj.startOf("month").add(1, "month").startOf("month").format("YYYY-MM-DD");
	},
	currentSecond() {
		return Math.floor(Date.now() / 1000);
	}
};
