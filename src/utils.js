export const getMinutesFromMillis = (totalTimeInMillis) => {
	const minutes = Math.floor(totalTimeInMillis / 60000);
	const seconds = ((totalTimeInMillis % 60000) / 1000).toFixed(0);
	return seconds === 60
		? minutes + 1 + ':00'
		: minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

export const sortLeaderboard = (layoutState) => {
	return Object.values(layoutState.allScores).sort(
		(a, b) =>
			a[layoutState.images[layoutState.currentImageIndex].string] -
			b[layoutState.images[layoutState.currentImageIndex].string]
	);
};
