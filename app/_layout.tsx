import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useAnonymousAuth } from "@/hooks/useAnonymousAuth";

export default function RootLayout() {
    const { ready } = useAnonymousAuth();

    if (!ready) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack initialRouteName="(Projects)">
            <Stack.Screen name="(Projects)" options={{ headerShown: false }} />
            <Stack.Screen name="project/[projectId]" options={{ title: "Project Details" }} />
            <Stack.Screen name="project/[projectId]/add-expense" options={{ title: "Add Expense" }} />
        </Stack>
    );
}