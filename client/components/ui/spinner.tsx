import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className, size = "md", ...props }: React.SVGProps<SVGSVGElement> & { size?: "sm" | "md" | "lg" | "xl" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  return (
    <div className="flex w-full items-center justify-center p-4">
      <Loader2 
        className={cn("animate-spin text-muted-foreground", sizeClasses[size], className)} 
        {...props} 
      />
    </div>
  );
}
