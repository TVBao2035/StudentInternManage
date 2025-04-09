import { useEffect, useState } from "react";


function useDebounce(value, delay = 1000){
    const [valueDebounce, setValueDebounce] = useState(value);

    useEffect(()=>{
        const timerId = setTimeout(() => {
            setValueDebounce(value);
        },delay);
        return ()=>clearTimeout(timerId);
    }, [value])

    return valueDebounce;
}

export default useDebounce;