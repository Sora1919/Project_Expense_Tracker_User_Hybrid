import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { onValue, ref } from "firebase/database";
import { db } from "@/constants/firebase";
import { Project } from "@/constants/types";
import { useCloudFavourites } from "@/hooks/useCloudFavourites";
import { router } from "expo-router";

export default function FavouritesTab() {
    const [projects, setProjects] = useState<Project[]>([]);
    const { favs, toggle, isFav } = useCloudFavourites();



    useEffect(() => {
        const projectsRef = ref(db, "projects");
        const unsub = onValue(projectsRef, (snap) => {
            const val = snap.val() || {};
            const list: Project[] = Object.entries(val).map(([projectId, data]: any) => ({
                projectId,
                projectName: data.projectName ?? "",
                description: data.description ?? "",
                startDate: data.startDate ?? "",
                endDate: data.endDate ?? "",
                projectManager: data.projectManager ?? "",
                projectStatus: data.projectStatus ?? "",
                budget: Number(data.budget ?? 0),
            }));
            setProjects(list);
        });

        return () => unsub();
    }, []);

    const favourites = projects.filter((p) => favs.includes(p.projectId));

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontWeight: "700", fontSize: 18, marginBottom: 10, padding:20 }}>Favourites</Text>

            <FlatList
                data={favourites}
                keyExtractor={(item) => item.projectId}
                ListEmptyComponent={<Text>No favourites yet. Star some projects ⭐</Text>}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => router.push(`/project/${item.projectId}`)}
                        style={{ padding: 12, borderWidth: 1, borderColor: "#eee", borderRadius: 12, marginBottom: 10 }}
                    >
                        <Text style={{ fontWeight: "700" }}>{item.projectName}</Text>
                        <Text style={{ opacity: 0.75 }}>{item.projectId}</Text>

                        <Pressable onPress={() => toggle(item.projectId)} style={{ marginTop: 8 }}>
                            <Text>Remove ⭐</Text>
                        </Pressable>
                    </Pressable>
                )}
            />
        </View>
    );
}