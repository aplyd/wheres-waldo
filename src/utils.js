export const getMinutesFromMillis = (totalTimeInMillis) => {
	const minutes = Math.floor(totalTimeInMillis / 60000);
	const seconds = ((totalTimeInMillis % 60000) / 1000).toFixed(0);
	return seconds === 60
		? minutes + 1 + ':00'
		: minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

export const sortLeaderboard = (layoutState) => {
	const scores = [];

	for (let i in layoutState.allScores) {
		const user = Object.entries(
			layoutState.allScores[i][
				layoutState.images[layoutState.currentImageIndex].string
			]
		);
		for (let j = 0; j < user.length; j++) {
			scores.push({
				name: layoutState.allScores[i].name,
				time: user[j][1],
			});
		}
	}

	return scores.sort((a, b) => a.time - b.time);
};
