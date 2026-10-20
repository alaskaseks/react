import { useEffect, useRef, useState } from "react";

function Counter(){
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        document.title = `Count: ${count}`;
    }, [count])

    return(
        <div>
            <h2>1. Counter</h2>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+</button>
            <button onClick={() => setCount(count - 1)}>-</button>
        </div>
    )
}

function Stopwatch(){
    const [seconds, setSeconds] = useState<number>(0);
    const [running, setRunning] = useState<boolean>(false);

    useEffect(() => {
        if (!running) return;

        const timer = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [running])

    return(
        <div>
            <h2>2. Stopwatch</h2>
            <p>{seconds} s</p>
            <button onClick={() => setRunning(!running)}>{running ? "Stop" : "Start"}</button>
            <button onClick={() => setSeconds(0)}>Reset</button>
        </div>
    )
}

function SavedInput(){
    const [text, setText] = useState<string>(() => localStorage.getItem("text") ?? "");

    useEffect(() => {
        localStorage.setItem("text", text);
    }, [text])

    return(
        <div>
            <h2>3. Saved text</h2>
            <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type something and reload the page"
            />
        </div>
    )
}

function AutoFocusInput(){
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, [])

    return(
        <div>
            <h2>4. Autofocus</h2>
            <input ref={inputRef} placeholder="I am focused after mount" />
        </div>
    )
}

const slides: string[] = ["Card 1", "Card 2", "Card 3", "Card 4"];

function Slider(){
    const [index, setIndex] = useState<number>(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex(prev => (prev + 1) % slides.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [])

    return(
        <div>
            <h2>5. Slider</h2>
            <div style={{ border: "1px solid gray", borderRadius: 8, padding: 32, textAlign: "center" }}>
                {slides[index]}
            </div>
            <p>{index + 1} / {slides.length}</p>
        </div>
    )
}

function App(){
    return(
        <div style={{ maxWidth: 500, margin: "0 auto", padding: 16, textAlign: "left" }}>
            <Counter />
            <Stopwatch />
            <SavedInput />
            <AutoFocusInput />
            <Slider />
        </div>
    )
}

export default App;