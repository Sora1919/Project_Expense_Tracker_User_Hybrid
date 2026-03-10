import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { onValue, ref } from "firebase/database";
import { db } from "@/constants/firebase";
import { Project } from "@/constants/types";
import { useCloudFavourites } from "@/hooks/useCloudFavourites";
import { useNetInfo } from "@react-native-community/netinfo";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ui } from "@/constants/ui";

export default function ProjectsTab() {
  const netInfo = useNetInfo();
  const isOnline = !!netInfo.isConnected;

  const [projects, setProjects] = useState<Project[]>([]);
  const [nameQuery, setNameQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");

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
        specialRequirements: data.specialRequirements ?? null,
        clientDepartment: data.clientDepartment ?? null,
        priority: data.priority ?? null,
      }));
      setProjects(list);
    });

    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const nq = nameQuery.trim().toLowerCase();
    const dq = dateQuery.trim(); // allow partial: "2026-03" or full: "2026-03-05"

    const base = projects.filter((p) => {
      const nameOk =
          !nq ||
          (p.projectName ?? "").toLowerCase().includes(nq) ||
          (p.description ?? "").toLowerCase().includes(nq);

      const dateOk =
          !dq ||
          (p.startDate ?? "").includes(dq) ||
          (p.endDate ?? "").includes(dq);

      return nameOk && dateOk;
    });

    // favourites first
    base.sort((a, b) => {
      const af = favs.includes(a.projectId) ? 1 : 0;
      const bf = favs.includes(b.projectId) ? 1 : 0;
      if (af !== bf) return bf - af;
      return (a.projectName ?? "").localeCompare(b.projectName ?? "");
    });

    return base;
  }, [projects, nameQuery, dateQuery, favs]);

  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: ui.colors.bg }}>
          <View style={{ flex: 1, padding: 16 }}>
            {!isOnline && (
                <Text style={{ marginBottom: 8, color: "crimson" }}>
                  Offline mode: cloud data may not refresh.
                </Text>
            )}

            <TextInput
                placeholder="Search by name or description..."
                value={nameQuery}
                onChangeText={setNameQuery}
                style={{
                    backgroundColor: ui.colors.card,
                    borderWidth: 1,
                    borderColor: ui.colors.border,
                    borderRadius: ui.radius,
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    marginBottom: 10,
                    color: ui.colors.text,
                }}
                placeholderTextColor={ui.colors.subText}
            />

            <TextInput
                placeholder="Search by date (e.g. 2026-03 or 2026-03-05)..."
                value={dateQuery}
                onChangeText={setDateQuery}
                style={{
                    backgroundColor: ui.colors.card,
                    borderWidth: 1,
                    borderColor: ui.colors.border,
                    borderRadius: ui.radius,
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    marginBottom: 10,
                    color: ui.colors.text,
                }}
                placeholderTextColor={ui.colors.subText}
            />

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.projectId}
                ListEmptyComponent={<Text>No projects found.</Text>}
                renderItem={({ item }) => {

                    const starred = isFav(item.projectId);

                  return (
                      <Pressable
                          onPress={() => router.push({
                              pathname: "/project/[projectId]",
                              params: { projectId: item.projectId },
                          })}
                          style={{
                              backgroundColor: ui.colors.card,
                              padding: ui.pad,
                              borderWidth: 1,
                              borderColor: ui.colors.border,
                              borderRadius: ui.radius,
                              marginBottom: 12,
                          }}
                      >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: "700", fontSize: 16, color: ui.colors.text }}>{item.projectName}</Text>
                            <Text style={{ opacity: 0.75, color: ui.colors.subText, marginTop: 4 }}>
                              {item.projectId} • {item.projectStatus}
                            </Text>
                            <Text style={{ opacity: 0.75, color: ui.colors.subText }}>
                              {item.startDate} → {item.endDate}
                            </Text>
                          </View>

                          <Pressable onPress={() => toggle(item.projectId)} style={{ padding: 6 }}>
                              <Text style={{ fontSize: 20, color: starred ? "#F59E0B" : ui.colors.subText }}>
                                  {starred ? "★" : "☆"}
                              </Text>
                          </Pressable>
                        </View>
                      </Pressable>
                  );
                }}
            />
          </View>
      </SafeAreaView>
  );
}