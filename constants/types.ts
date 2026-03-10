export type Project = {
    projectId: string;
    projectName: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    projectManager?: string;
    projectStatus?: string;
    budget?: number;
    specialRequirements?: string | null;
    clientDepartment?: string | null;
    priority?: string | null;
};

export type Expense = {
    expenseId: string;
    projectId: string;
    dateOfExpense: string;
    amount: number;
    currency: string;
    typeOfExpense: string;
    paymentMethod: string;
    paymentStatus: string;
    claimant: string;
    description?: string | null;
    location?: string | null;
    updatedAt?: number;
};