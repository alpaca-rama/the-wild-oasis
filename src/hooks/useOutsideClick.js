import {useEffect, useRef} from "react";

export function useOutsideClick(handler, listenCapturing = true) {
    const ref = useRef()

    // Close modal window when clicking outside of the modal.
    useEffect(function() {
        function handleOutsideClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                handler()
            }
        }

        document.addEventListener('click', handleOutsideClick, listenCapturing)

        return () => document.removeEventListener('click', handleOutsideClick, listenCapturing)
    }, [handler, listenCapturing])

    return ref
}