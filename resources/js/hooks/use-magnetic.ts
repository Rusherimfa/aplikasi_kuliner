import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export function useMagnetic() {
    const magneticRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = magneticRef.current;
        if (!element) return;

        const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { width, height, left, top } = element.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            
            // Influence radius check (optional, but good for UX)
            // If the cursor is close enough, move it
            xTo(x * 0.3);
            yTo(y * 0.3);
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            element.removeEventListener("mousemove", handleMouseMove);
            element.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return magneticRef;
}
