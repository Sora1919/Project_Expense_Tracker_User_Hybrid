import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { onValue, ref } from "firebase/database";
import { db } from "@/constants/firebase";
import { Expense, Project } from "@/constants/types";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ui } from "@/constants/ui";

export default function ProjectDetailScreen() {
    const params = useLocalSearchParams<{ projectId?: string | string[] }>();
    const projectId = useMemo(() => {
        const p = params.projectId;
        return Array.isArray(p) ? p[0] : p;
    }, [params.projectId]);

    const [project, setProject] = useState<Project | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        if (!projectId) return;

        const pRef = ref(db, `projects/${projectId}`);
        const unsubP = onValue(pRef, (snap) => {
            const data = snap.val();
            if (!data) setProject(null);
            else setProject({ projectId, ...data });
        });

        const eRef = ref(db, `projects/${projectId}/expenses`);
        const unsubE = onValue(eRef, (snap) => {
            const val = snap.val() || {};
            const list: Expense[] = Object.entries(val).map(([expenseId, data]: any) => ({
                expenseId,
                ...data,
            }));
            setExpenses(list);
        });

        return () => {
            unsubP();
            unsubE();
        };
    }, [projectId]);


    if (!projectId) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: ui.colors.bg, justifyContent: "center", padding: 16 }}>
                <Text style={{ color: ui.colors.text, fontWeight: "700", fontSize: 16, textAlign: "center" }}>
                    Missing project ID
                </Text>
                <Text style={{ color: ui.colors.subText, marginTop: 8, textAlign: "center" }}>
                    Please go back and open a project again.
                </Text>

                <Pressable
                    onPress={() => router.replace("/(Projects)")}
                    style={{
                        marginTop: 16,
                        backgroundColor: ui.colors.primary,
                        paddingVertical: 14,
                        borderRadius: ui.radius,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "700" }}>Back to Projects</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    if (!project) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: ui.colors.bg, padding: 16 }}>
                <Text style={{ color: ui.colors.text }}>Project not found.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: ui.colors.bg }}>
            <View style={{ flex: 1, padding: 16 }}>
                <View
                    style={{
                        backgroundColor: ui.colors.card,
                        borderWidth: 1,
                        borderColor: ui.colors.border,
                        borderRadius: ui.radius,
                        padding: ui.pad,
                    }}
                >
                    <Text style={{ fontWeight: "700", fontSize: 18, color: ui.colors.text }}>
                        {project.projectName}
                    </Text>

                    <Text style={{ color: ui.colors.subText, marginTop: 6 }}>
                        {project.projectId} • {project.projectStatus}
                    </Text>

                    <Text style={{ color: ui.colors.subText }}>
                        {project.startDate} → {project.endDate}
                    </Text>

                    <Text style={{ marginTop: 10, color: ui.colors.text }}>
                        {project.description}
                    </Text>

                    <Pressable
                        onPress={() =>
                            router.push({
                                pathname: "/project/[projectId]/add-expense",
                                params: { projectId },
                            })
                        }
                        style={{
                            marginTop: 14,
                            backgroundColor: ui.colors.primary,
                            paddingVertical: 12,
                            borderRadius: ui.radius,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ fontWeight: "700", color: "white" }}>Add Expense</Text>
                    </Pressable>
                </View>

                <Text style={{ marginTop: 16, fontWeight: "700", color: ui.colors.text }}>
                    Expenses
                </Text>

                <FlatList
                    data={expenses}
                    keyExtractor={(item) => item.expenseId}
                    style={{ marginTop: 10 }}
                    ListEmptyComponent={<Text style={{ color: ui.colors.subText }}>No expenses yet.</Text>}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                backgroundColor: ui.colors.card,
                                borderWidth: 1,
                                borderColor: ui.colors.border,
                                borderRadius: ui.radius,
                                padding: ui.pad,
                                marginBottom: 10,
                            }}
                        >
                            <Text style={{ fontWeight: "700", color: ui.colors.text }}>
                                {item.dateOfExpense} • {item.typeOfExpense}
                            </Text>
                            <Text style={{ color: ui.colors.text, marginTop: 4 }}>
                                Amount: {item.amount} {item.currency} • {item.paymentStatus}
                            </Text>
                            <Text style={{ color: ui.colors.subText, marginTop: 4 }}>
                                Claimant: {item.claimant}
                            </Text>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}