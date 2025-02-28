import { create } from "zustand";

export const useCrudStore = create((set, get) => ({
    op: null,
    selectedItem: null,

    setOp: (newVal) => {
        set(() => ({ op: newVal }));
    },

    setSelectedItem: (newVal) => {
        set(() => ({ selectedItem: newVal }));
    },
}));
