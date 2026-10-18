import { useEffect, useState } from "react";
import photo from "./f5dbd198-b52e-48fe-9a6e-479e3e560405.jpg";

function App(){
    const [radius, setRadius] = useState<number>(0);
    const handleMove = () => {
        setRadius(prev => prev + 1);
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setRadius(0);
        }, 3000);

        return () => clearTimeout(timer);
    }, [radius])
    return(
        <div>

        <img
            src={photo}
            onMouseMove={handleMove}
            style={{ borderRadius: `${radius}px` }}
        />
        </div>
    )
}

export default App;
