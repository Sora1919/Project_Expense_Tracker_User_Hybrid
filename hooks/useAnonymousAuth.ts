import { useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "@/constants/firebase";

export function useAnonymousAuth() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            try {
                if (!user) {
                    await signInAnonymously(auth);
                }
            } catch (e) {
                console.log("Anonymous auth failed:", e);
            } finally {
                setReady(true);
            }
        });

        return () => unsub();
    }, []);

    return { ready };
}