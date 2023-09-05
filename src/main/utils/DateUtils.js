import moment from "moment";
import "moment-timezone";

export default {
	formatPreMonthStartDate(timezone, length) {
		const momentObj = timezone ? moment().tz(timezone) : moment();
		return momentObj.startOf("month").add(-length, "month").startOf("month").format("YYYY-MM-DD");
	},
	formatMonthStartDate(timezone) {
		const momentObj = timezone ? moment().tz(timezone) : moment();
		return momentObj.startOf("month").format("YYYY-MM-DD");
	},
	formatNextMonthStartDate(timezone) {
		const momentObj = timezone ? moment().tz(timezone) : moment();
		return momentObj.startOf("month").add(1, "month").startOf("month").format("YYYY-MM-DD");
	},
	formatYMD() {
		return moment().format("YYYY-MM-DD");
	},
	currentSecond() {
		return Math.floor(Date.now() / 1000);
	}
};
