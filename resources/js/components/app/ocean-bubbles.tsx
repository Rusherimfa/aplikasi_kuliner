import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function OceanBubbles() {
    const [bubbles, setBubbles] = useState<{ id: number; x: number; size: number; duration: number; delay: number }[]>([]);

    useEffect(() => {
        // Reduced bubble count from 20 to 10 for better performance on low end devices
        const newBubbles = Array.from({ length: 10 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            size: Math.random() * 10 + 5,
            duration: Math.random() * 15 + 10,
            delay: Math.random() * 20,
        }));
        setBubbles(newBubbles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {bubbles.map((bubble) => (
                <motion.div
                    key={bubble.id}
                    initial={{ y: '110vh', opacity: 0 }}
                    animate={{
                        y: '-10vh',
                        opacity: [0, 0.3, 0.3, 0],
                        x: `calc(${bubble.x}vw + ${Math.sin(bubble.id) * 50}px)`,
                    }}
                    transition={{
                        duration: bubble.duration,
                        repeat: Infinity,
                        delay: bubble.delay,
                        ease: "linear",
                    }}
                    className="absolute rounded-full border border-primary/20 bg-primary/10"
                    style={{
                        width: bubble.size,
                        height: bubble.size,
                        left: `${bubble.x}vw`,
                    }}
                />
            ))}
        </div>
    );
}
