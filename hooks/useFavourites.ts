import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "favourite_projects";

export function useFavourites() {
    const [favs, setFavs] = useState<string[]>([]);

    const load = useCallback(async () => {
        const raw = await AsyncStorage.getItem(KEY);
        setFavs(raw ? JSON.parse(raw) : []);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const toggle = useCallback(async (projectId: string) => {
        setFavs((prev) => {
            const next = prev.includes(projectId)
                ? prev.filter((id) => id !== projectId)
                : [...prev, projectId];
            AsyncStorage.setItem(KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    return { favs, toggle, reload: load };
}