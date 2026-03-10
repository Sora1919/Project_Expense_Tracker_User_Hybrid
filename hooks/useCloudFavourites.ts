import { useEffect, useMemo, useState } from "react";
import { onValue, ref, set, remove } from "firebase/database";
import { auth, db } from "@/constants/firebase";

export function useCloudFavourites() {
    const uid = auth.currentUser?.uid;
    const [favsMap, setFavsMap] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!uid) return;

        const favRef = ref(db, `userFavourites/${uid}`);
        const unsub = onValue(favRef, (snap) => {
            setFavsMap(snap.val() || {});
        });

        return () => unsub();
    }, [uid]);

    const favs = useMemo(() => Object.keys(favsMap), [favsMap]);

    const isFav = (projectId: string) => favsMap[projectId];

    const toggle = async (projectId: string) => {
        if (!uid) return;

        const pRef = ref(db, `userFavourites/${uid}/${projectId}`);
        if (isFav(projectId)) {
            await remove(pRef);
        } else {
            await set(pRef, true);
        }
    };

    return { favs, isFav, toggle };
}