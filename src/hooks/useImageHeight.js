import { useCallback, useRef, useState } from 'react';

export const useImageHeight = () => {
	const ref = useRef(null);
	const [observedHeight, setObservedHeight] = useState(null);
	const setRef = useCallback((node) => {
		const observer = new ResizeObserver((entries) => {
			setObservedHeight(entries[0].contentRect.height);
		});

		if (ref.current) {
			observer.unobserve(node);
		}

		if (node) {
			observer.observe(node);
		}
		ref.current = node;
	}, []);

	return [setRef, observedHeight];
};
