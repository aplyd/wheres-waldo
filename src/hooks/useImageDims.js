import { useCallback, useRef, useState } from 'react';

export const useImageDims = () => {
	const ref = useRef(null);
	const [observedDims, setObservedDims] = useState(null);
	const setRef = useCallback((node) => {
		const observer = new ResizeObserver((entries) => {
			setObservedDims({
				height: entries[0].contentRect.height,
				width: entries[0].contentRect.width,
			});
		});

		if (ref.current) {
			observer.unobserve(node);
		}

		if (node) {
			observer.observe(node);
		}
		ref.current = node;
	}, []);

	return [setRef, observedDims];
};
