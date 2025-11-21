import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SelectDropDown } from "@/components/ui/select";
import { useUserStore } from "@/stores/useAuthStore";

function UserProfile() {
  const { user } = useUserStore();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>("");

  return (
    <div className="font-quicksand text-base-black flex items-center gap-4 px-4 text-left text-base leading-[100%] font-bold tracking-[0%] lg:px-8">
      <Avatar className="size-[60px]">
        <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
        <AvatarFallback className="bg-base-blue-cream text-2xl font-medium">
          {(user?.name
            ? user.name
                .split(" ")
                .map((w) => w[0])
                .join("")
            : "N/A"
          )
            ?.toUpperCase()
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      <div className="grid flex-1 gap-1 text-left leading-tight">
        <h1 className="truncate">Hello, Mr. {user?.name}</h1>
        <p className="text-base-gray truncate font-medium">
          Welcome to Limospro Dashboard
        </p>
      </div>

      <SelectDropDown
        placeholder="All Time"
        items={[
          { label: "All Time", value: "all" },
          { label: "Weekly", value: "weekly" },
          { label: "Monthly", value: "monthly" },
          { label: "Quarterly", value: "quarterly" },
          { label: "6 Months", value: "6_months" },
          { label: "Yearly", value: "yearly" },
        ]}
        value={selectedStatus}
        setSelectedItem={(value) => setSelectedStatus(value)}
      />
    </div>
  );
}

export default UserProfile;
