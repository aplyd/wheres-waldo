import { useEffect, useCallback, useRef, useState } from 'react';
import { getImageDims } from '../utils';
// export const useImageHeight = (imageSrc, dispatch) => {
// 	useEffect(() => {
// 		const handleResize = () => {
// 			if (imageSrc) {
// 				const imageDims = getImageDims(imageSrc);
// 				console.log('dims');
// 				dispatch({
// 					type: 'image resize',
// 					height: imageDims.top - imageDims.bottom,
// 				});
// 			}
// 			console.log('resizing');
// 		};
// 		handleResize();

// 		window.addEventListener('resize', handleResize);

// 		return () => {
// 			window.removeEventListener('resize', handleResize);
// 		};
// 	}, [dispatch, imageSrc]);
// };

export const useImageHeight = (imageSrc, dispatch) => {
	const ref = useRef(null);
	const [observedHeight, setObservedHeight] = useState(null);

	const observer = new ResizeObserver((entries) => {
		console.log(entries[0].contentRect);
	});
	// const [state, setState] = useState()
	const setRef = useCallback(
		(node) => {
			if (ref.current) {
				observer.unobserve(node);
			}

			if (node) {
				observer.observe(node);
			}
			ref.current = node;
		},
		[observer]
	);

	// const handleResize = () => {
	// 	if (imageSrc) {
	// 		const imageDims = getImageDims(imageSrc);
	// 		console.log('dims');
	// 		dispatch({
	// 			type: 'image resize',
	// 			height: imageDims.top - imageDims.bottom,
	// 		});
	// 	}
	// 	console.log('resizing');
	// };
	// handleResize();

	// window.addEventListener('resize', handleResize);

	// 	window.removeEventListener('resize', handleResize);

	return [setRef, observedHeight];
};
