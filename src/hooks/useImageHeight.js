export const useImageHeight = (imgSrc) => {
	if (imgSrc) {
		let rect = imgSrc.getBoundingClientRect();
		console.log({ imgSrc });
		console.log({ rect });
	}
};
