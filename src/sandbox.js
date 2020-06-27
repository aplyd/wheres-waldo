export const sortResults = (allScores) => {
	const compareTimes = (a, b) => new Date(a.imageOne) - new Date(b.imageOne);
	return Object.values(allScores).sort(compareTimes);
};
