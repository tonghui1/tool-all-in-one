"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, ...props }, ref) => {
    const [tabValue, setTabValue] = React.useState(value || defaultValue)
    
    React.useEffect(() => {
      if (value !== undefined) {
        setTabValue(value)
      }
    }, [value])

    const handleValueChange = React.useCallback((newValue: string) => {
      setTabValue(newValue)
      onValueChange?.(newValue)
    }, [onValueChange])
    
    return (
      <div
        ref={ref}
        className={cn("", className)}
        {...props}
        data-tab-value={tabValue}
      />
    )
  }
)
Tabs.displayName = "Tabs"

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      role="tablist"
      {...props}
    />
  )
)
TabsList.displayName = "TabsList"

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    
    if (!context) {
      throw new Error("TabsTrigger must be used within a Tabs component")
    }
    
    const isActive = context.value === value
    
    const handleClick = () => {
      context.onValueChange(value)
    }
    
    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isActive}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isActive 
            ? "bg-background text-foreground shadow-sm" 
            : "hover:bg-background/50 hover:text-foreground",
          className
        )}
        onClick={handleClick}
        data-state={isActive ? "active" : "inactive"}
        {...props}
      />
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    
    if (!context) {
      throw new Error("TabsContent must be used within a Tabs component")
    }
    
    const isActive = context.value === value

    if (!isActive) return null
    
    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn("mt-2", className)}
        hidden={!isActive}
        data-state={isActive ? "active" : "inactive"}
        tabIndex={isActive ? 0 : -1}
        {...props}
      />
    )
  }
)
TabsContent.displayName = "TabsContent"

// 创建一个Context来传递当前选中的tab
interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextType | null>(null)

// 包装Tabs组件以提供Context
const TabsProvider: React.FC<TabsProps & { children: React.ReactNode }> = ({ 
  defaultValue, 
  value, 
  onValueChange,
  children,
  ...props 
}) => {
  const [tabValue, setTabValue] = React.useState(value || defaultValue)
  
  React.useEffect(() => {
    if (value !== undefined) {
      setTabValue(value)
    }
  }, [value])
  
  const handleValueChange = React.useCallback((newValue: string) => {
    if (value === undefined) {
      setTabValue(newValue)
    }
    onValueChange?.(newValue)
  }, [onValueChange, value])
  
  return (
    <TabsContext.Provider value={{ value: tabValue, onValueChange: handleValueChange }}>
      <Tabs defaultValue={defaultValue} value={tabValue} onValueChange={handleValueChange} {...props}>
        {children}
      </Tabs>
    </TabsContext.Provider>
  )
}

// 导出包含Provider的Tabs
export { TabsProvider as Tabs, TabsList, TabsTrigger, TabsContent } 