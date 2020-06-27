import { sortResults } from './sandbox';

const allScoresTestData1 = {
	uid: 123,
	imageOne: '0:45',
	name: '',
};
const allScoresTestData2 = {
	uid: 123,
	imageOne: '2:45',
	name: '',
};
const allScoresTestData3 = {
	uid: 123,
	imageOne: '0:12',
	name: '',
};
const allScoresTestData4 = {
	uid: 123,
	imageOne: '7:52',
	name: '',
};
const allScoresTestData5 = {
	uid: 123,
	imageOne: '10:12',
	name: '',
};

const unsortedScores = {
	allScoresTestData1,
	allScoresTestData4,
	allScoresTestData2,
	allScoresTestData3,
	allScoresTestData5,
};
const correctOrder = [
	allScoresTestData3,
	allScoresTestData1,
	allScoresTestData2,
	allScoresTestData4,
	allScoresTestData5,
];

test('', () => {
	console.log(sortResults(unsortedScores));
	console.log(correctOrder);
	expect(sortResults(unsortedScores)).toStrictEqual(correctOrder);
});
