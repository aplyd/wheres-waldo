export const getImageDims = (imgSrc) => {
	let rect = imgSrc.getBoundingClientRect();
	return { top: rect.top, bottom: rect.bottom };
};
