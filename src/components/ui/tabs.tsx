"use client"

import * as React from "react"

// Wait, I don't have radix-ui installed. I should install it or build a custom one.
// The plan didn't include radix-ui. I'll build a custom simple Tabs component to avoid extra deps for now.
// Actually, standard accessible tabs are hard to build from scratch.
// I'll build a visual-only tabs component controlled by props or context if needed, or just simple state.
// Let's build a simple one using Context.

import { cn } from "@/lib/utils"

interface TabsContextType {
    activeTab: string;
    setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export function Tabs({ value, defaultValue, children, className, onValueChange }: { value?: string, defaultValue?: string, children: React.ReactNode, className?: string, onValueChange?: (value: string) => void }) {
    const [internalTab, setInternalTab] = React.useState(defaultValue || "");

    const isControlled = value !== undefined;
    const activeTab = isControlled ? value : internalTab;

    const handleTabChange = (val: string) => {
        if (!isControlled) {
            setInternalTab(val);
        }
        onValueChange?.(val);
    }

    return (
        <TabsContext.Provider value={{ activeTab: activeTab!, setActiveTab: handleTabChange }}>
            <div className={cn("", className)}>
                {children}
            </div>
        </TabsContext.Provider>
    )
}

export function TabsList({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>
            {children}
        </div>
    )
}

export function TabsTrigger({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within Tabs");

    const isActive = context.activeTab === value;

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive && "bg-background text-foreground shadow-sm",
                className
            )}
            onClick={() => context.setActiveTab(value)}
        >
            {children}
        </button>
    )
}

export function TabsContent({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within Tabs");

    if (context.activeTab !== value) return null;

    return (
        <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>
            {children}
        </div>
    )
}
