import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: "mongodb" | "neodb" | "neodb-secondary" | "status-info";
  trend?: string;
  trendText?: string;
  statusIndicator?: boolean;
  statusText?: string;
}

const colorMap = {
  "mongodb": {
    borderColor: "border-[#00684A]",
    bgColor: "bg-[#E3FCF2]",
    textColor: "text-[#00684A]",
  },
  "neodb": {
    borderColor: "border-[#1F4F9E]",
    bgColor: "bg-[#EBF1FF]",
    textColor: "text-[#1F4F9E]",
  },
  "neodb-secondary": {
    borderColor: "border-[#4A77D6]",
    bgColor: "bg-[#EBF1FF]",
    textColor: "text-[#4A77D6]",
  },
  "status-info": {
    borderColor: "border-[#3D89FF]",
    bgColor: "bg-blue-50",
    textColor: "text-[#3D89FF]",
  },
};

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color, 
  trend, 
  trendText,
  statusIndicator,
  statusText
}: StatsCardProps) => {
  const { borderColor, bgColor, textColor } = colorMap[color];
  
  return (
    <div className={cn("bg-white rounded-lg shadow p-5 border-l-4", borderColor)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-neutral-medium text-sm font-medium">{title}</p>
          <p className="text-3xl font-semibold mt-1">{value}</p>
        </div>
        <div className={cn("p-2 rounded-md", bgColor)}>
          <i className={cn(`ri-${icon} text-xl`, textColor)}></i>
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        {trend && (
          <>
            <i className="ri-arrow-up-line text-green-500 mr-1"></i>
            <span className="text-green-500 font-medium">{trend}</span>
            <span className="text-neutral-medium ml-1">{trendText}</span>
          </>
        )}
        {statusIndicator && (
          <>
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
            <span className="text-neutral-medium">{statusText}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
