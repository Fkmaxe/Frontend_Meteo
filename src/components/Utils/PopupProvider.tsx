// File: src/components/Utils/PopupProvider.tsx

"use client";

import React, {
    createContext,
    useContext,
    useReducer,
    ReactNode,
    useMemo,
} from "react";
import StatusPopup from "@/components/StatusPopup";

interface Popup {
    id: number;
    message: string;
    type: "success" | "error";
}

type PopupAction =
    | { type: "ADD"; payload: Popup }
    | { type: "REMOVE"; payload: number };

const popupReducer = (state: Popup[], action: PopupAction): Popup[] => {
    switch (action.type) {
        case "ADD":
            return [...state, action.payload];
        case "REMOVE":
            return state.filter((popup) => popup.id !== action.payload);
        default:
            return state;
    }
};

interface PopupContextProps {
    popups: Popup[];
    addPopup: (message: string, type: "success" | "error") => void;
    removePopup: (id: number) => void;
}

const PopupContext = createContext<PopupContextProps | undefined>(undefined);

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error("usePopup must be used within a PopupProvider");
    }
    return context;
};

export const PopupProvider: React.FC<{ children: ReactNode }> = ({
                                                                     children,
                                                                 }) => {
    const [popups, dispatch] = useReducer(popupReducer, []);

    const addPopup = (message: string, type: "success" | "error") => {
        const id = Date.now();
        dispatch({ type: "ADD", payload: { id, message, type } });
        // Automatically remove the popup after 5 seconds
        setTimeout(() => {
            dispatch({ type: "REMOVE", payload: id });
        }, 5000);
    };

    const removePopup = (id: number) => {
        dispatch({ type: "REMOVE", payload: id });
    };

    const contextValue = useMemo(
        () => ({ popups, addPopup, removePopup }),
        [popups]
    );

    return (
        <PopupContext.Provider value={contextValue}>
            {children}
            <div className="fixed top-0 left-0 z-50 p-4 flex flex-col gap-4">
                {popups.map((popup, index) => (
                    <div key={popup.id} style={{ transform: `translateY(${index * 70}px)` }}>
                        <StatusPopup
                            message={popup.message}
                            type={popup.type}
                            onClose={() => removePopup(popup.id)}
                        />
                    </div>
                ))}
            </div>
        </PopupContext.Provider>
    );
};