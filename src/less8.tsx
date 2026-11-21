import type React from "react"
import { useEffect, useRef, useState } from "react"

const buttonClass = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
const inputClass = "border-2 border-black px-2 py-1";

interface SectionProps{
    title: string;
    children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
    return(
        <section className="mb-8">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            {children}
        </section>
    )
}

const FocusInput: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    return(
        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input ref={inputRef} className={inputClass} placeholder="Type here" />
            <button type="button" className={buttonClass} onClick={() => inputRef.current?.focus()}>
                Focus input
            </button>
        </form>
    )
}

const Stopwatch: React.FC = () => {
    const [seconds, setSeconds] = useState<number>(0);
    const intervalRef = useRef<number | null>(null);

    const start = () => {
        if (intervalRef.current !== null) return;
        intervalRef.current = window.setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);
    }

    const stop = () => {
        if (intervalRef.current === null) return;
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
    }

    useEffect(() => {
        return () => {
            if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
        }
    }, [])

    return(
        <div>
            <p className="mb-2">{seconds} s</p>
            <div className="flex gap-2">
                <button className={buttonClass} onClick={start}>Start</button>
                <button className={buttonClass} onClick={stop}>Stop</button>
            </div>
        </div>
    )
}

const usePrevious = <T,>(value: T): T | undefined => {
    const ref = useRef<T | undefined>(undefined);

    useEffect(() => {
        ref.current = value;
    })

    return ref.current;
}

const PreviousValue: React.FC = () => {
    const [count, setCount] = useState<number>(0);
    const previous = usePrevious(count);

    return(
        <div>
            <p>Current: {count}</p>
            <p className="mb-2">Previous: {previous ?? "-"}</p>
            <button className={buttonClass} onClick={() => setCount(count + 1)}>+1</button>
        </div>
    )
}

const RenderCounter: React.FC = () => {
    const [text, setText] = useState<string>("");
    const renders = useRef<number>(0);

    renders.current += 1;

    return(
        <div>
            <input
                className={inputClass}
                placeholder="Type to re-render"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <p>Renders: {renders.current}</p>
        </div>
    )
}

const Dropdown: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        }
    }, [])

    return(
        <div ref={menuRef} className="relative inline-block">
            <button className={buttonClass} onClick={() => setOpen(!open)}>Menu</button>
            {open && (
                <ul className="absolute left-0 mt-1 w-40 bg-white text-black border border-gray-400 rounded shadow">
                    <li className="px-4 py-2 hover:bg-gray-100">Profile</li>
                    <li className="px-4 py-2 hover:bg-gray-100">Settings</li>
                    <li className="px-4 py-2 hover:bg-gray-100">Log out</li>
                </ul>
            )}
        </div>
    )
}

const VideoPlayer: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    return(
        <div>
            <video
                ref={videoRef}
                className="w-full max-w-md mb-2"
                src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            />
            <div className="flex gap-2">
                <button className={buttonClass} onClick={() => videoRef.current?.play()}>Play</button>
                <button className={buttonClass} onClick={() => videoRef.current?.pause()}>Pause</button>
            </div>
        </div>
    )
}

const ScrollToSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    return(
        <div>
            <button
                className={buttonClass}
                onClick={() => sectionRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
                Scroll to the section
            </button>
            <div className="h-[600px]" />
            <div ref={sectionRef} className="p-6 bg-blue-100 text-blue-900 rounded">
                Target section
            </div>
        </div>
    )
}

const CODE_LENGTH = 4;

const CodeForm: React.FC = () => {
    const [digits, setDigits] = useState<string[]>(Array<string>(CODE_LENGTH).fill(""));
    const [result, setResult] = useState<string>("");
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        setDigits(prev => prev.map((d, i) => i === index ? digit : d));

        if (digit && index < CODE_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setResult(digits.some(d => d === "") ? "Enter all digits" : `Code: ${digits.join("")}`);
    }

    return(
        <form onSubmit={handleSubmit}>
            <div className="flex gap-2 mb-2">
                {digits.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            inputsRef.current[index] = el;
                        }}
                        className="w-10 text-center border-2 border-black py-1"
                        value={digit}
                        maxLength={1}
                        inputMode="numeric"
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                    />
                ))}
            </div>
            <button type="submit" className={buttonClass}>Confirm</button>
            <p className="mt-2">{result}</p>
        </form>
    )
}

interface Size{
    width: number;
    height: number;
}

const SizeTracker: React.FC = () => {
    const boxRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<Size | null>(null);

    useEffect(() => {
        if (boxRef.current) {
            const rect = boxRef.current.getBoundingClientRect();
            setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
        }
    }, [])

    return(
        <div>
            <div ref={boxRef} className="w-1/2 p-4 border-2 border-black">Measured element</div>
            <p className="mt-2">
                {size ? `Width: ${size.width}px, height: ${size.height}px` : "Measuring..."}
            </p>
        </div>
    )
}

const RefInputForm: React.FC = () => {
    const textRef = useRef<string>("");
    const outputRef = useRef<HTMLParagraphElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (outputRef.current) {
            outputRef.current.textContent = `Submitted: ${textRef.current}`;
        }
    }

    return(
        <form onSubmit={handleSubmit} className="flex flex-col items-start gap-2">
            <input
                className={inputClass}
                placeholder="Type and submit"
                onChange={(e) => {
                    textRef.current = e.target.value;
                }}
            />
            <button type="submit" className={buttonClass}>Submit</button>
            <p ref={outputRef} />
        </form>
    )
}

const UseRefTasksPage: React.FC = () => {
    return(
        <div className="max-w-xl mx-auto p-4">
            <Section title="1. Focus on click"><FocusInput /></Section>
            <Section title="2. Stopwatch"><Stopwatch /></Section>
            <Section title="3. Previous value"><PreviousValue /></Section>
            <Section title="4. Render counter"><RenderCounter /></Section>
            <Section title="5. Dropdown"><Dropdown /></Section>
            <Section title="6. Video player"><VideoPlayer /></Section>
            <Section title="7. Smooth scroll"><ScrollToSection /></Section>
            <Section title="8. Code form"><CodeForm /></Section>
            <Section title="9. Element size"><SizeTracker /></Section>
            <Section title="10. Input stored in ref"><RefInputForm /></Section>
        </div>
    )
}

export default UseRefTasksPage