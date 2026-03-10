import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { set, ref } from "firebase/database";
import { db } from "@/constants/firebase";
import { useLocalSearchParams, router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { useNetInfo } from "@react-native-community/netinfo";
import { SafeAreaView } from "react-native-safe-area-context";
import { ui } from "@/constants/ui";

const TYPES = ["Travel", "Equipment", "Materials", "Services", "Software/Licenses", "Labour costs", "Utilities", "Miscellaneous"];
const METHODS = ["Cash", "Credit Card", "Bank Transfer", "Cheque"];
const STATUSES = ["Paid", "Pending", "Reimbursed"];
const CURRENCIES = ["MMK", "USD", "GBP", "EUR"];

export default function AddExpenseScreen() {
    const { projectId } = useLocalSearchParams<{ projectId: string }>();
    const netInfo = useNetInfo();
    const isOnline = !!netInfo.isConnected;

    const [dateOfExpense, setDateOfExpense] = useState("");
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState(CURRENCIES[0]);
    const [typeOfExpense, setType] = useState(TYPES[0]);
    const [paymentMethod, setMethod] = useState(METHODS[0]);
    const [paymentStatus, setStatus] = useState(STATUSES[0]);
    const [claimant, setClaimant] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");

    const inputStyle = {
        backgroundColor: ui.colors.card,
        borderWidth: 1,
        borderColor: ui.colors.border,
        borderRadius: ui.radius,
        paddingVertical: 12,
        paddingHorizontal: 12,
        color: ui.colors.text,
    };

    const labelStyle = { fontWeight: "700" as const, color: ui.colors.text, marginTop: 4 };

    const pickerBox = {
        backgroundColor: ui.colors.card,
        borderWidth: 1,
        borderColor: ui.colors.border,
        borderRadius: ui.radius,
        overflow: "hidden" as const,
    };

    const save = async () => {
        if (!projectId) return;

        if (!isOnline) {
            Alert.alert("Offline", "Please connect to the internet to upload an expense.");
            return;
        }

        if (!dateOfExpense.trim() || !amount.trim() || !claimant.trim()) {
            Alert.alert("Missing fields", "Please fill Date, Amount, and Claimant.");
            return;
        }

        const amountNum = Number(amount);
        if (!Number.isFinite(amountNum) || amountNum <= 0) {
            Alert.alert("Invalid amount", "Please enter a valid number.");
            return;
        }

        const expenseId = `EXP-${Date.now()}`;

        const payload = {
            expenseId,
            projectId,
            dateOfExpense: dateOfExpense.trim(),
            amount: amountNum,
            currency,
            typeOfExpense,
            paymentMethod,
            paymentStatus,
            claimant: claimant.trim(),
            description: description.trim() || null,
            location: location.trim() || null,
            updatedAt: Date.now(),
        };

        await set(ref(db, `projects/${projectId}/expenses/${expenseId}`), payload);
        router.back();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: ui.colors.bg }}>
            <View style={{ flex: 1, padding: 16, gap: 10 }}>
                <TextInput
                    placeholder="Date (yyyy-MM-dd)"
                    value={dateOfExpense}
                    onChangeText={setDateOfExpense}
                    placeholderTextColor={ui.colors.subText}
                    style={inputStyle}
                />

                <TextInput
                    placeholder="Amount"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    placeholderTextColor={ui.colors.subText}
                    style={inputStyle}
                />

                <Text style={labelStyle}>Currency</Text>
                <View style={pickerBox}>
                    <Picker selectedValue={currency} onValueChange={setCurrency}>
                        {CURRENCIES.map((c) => <Picker.Item key={c} label={c} value={c} />)}
                    </Picker>
                </View>

                <Text style={labelStyle}>Type</Text>
                <View style={pickerBox}>
                    <Picker selectedValue={typeOfExpense} onValueChange={setType}>
                        {TYPES.map((t) => <Picker.Item key={t} label={t} value={t} />)}
                    </Picker>
                </View>

                <Text style={labelStyle}>Payment Method</Text>
                <View style={pickerBox}>
                    <Picker selectedValue={paymentMethod} onValueChange={setMethod}>
                        {METHODS.map((m) => <Picker.Item key={m} label={m} value={m} />)}
                    </Picker>
                </View>

                <Text style={labelStyle}>Payment Status</Text>
                <View style={pickerBox}>
                    <Picker selectedValue={paymentStatus} onValueChange={setStatus}>
                        {STATUSES.map((s) => <Picker.Item key={s} label={s} value={s} />)}
                    </Picker>
                </View>

                <TextInput
                    placeholder="Claimant"
                    value={claimant}
                    onChangeText={setClaimant}
                    placeholderTextColor={ui.colors.subText}
                    style={inputStyle}
                />

                <TextInput
                    placeholder="Description (optional)"
                    value={description}
                    onChangeText={setDescription}
                    placeholderTextColor={ui.colors.subText}
                    style={inputStyle}
                />

                <TextInput
                    placeholder="Location (optional)"
                    value={location}
                    onChangeText={setLocation}
                    placeholderTextColor={ui.colors.subText}
                    style={inputStyle}
                />

                <Pressable
                    onPress={save}
                    style={{
                        marginTop: 8,
                        backgroundColor: ui.colors.primary,
                        paddingVertical: 14,
                        borderRadius: ui.radius,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontWeight: "700", color: "white" }}>Save Expense</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}