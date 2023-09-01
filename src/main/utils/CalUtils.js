export default {
	progressPercentage(usage, total) {
		return (usage / total).toFixed(4);
	}
};
