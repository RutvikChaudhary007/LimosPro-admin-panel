import { IconFilterX } from "@tabler/icons-react";
import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SelectDropDown } from "@/components/ui/select";
import { useUserStore } from "@/stores/useAuthStore";

function UserProfile({
  selectedTime,
  setSelectedTime,
  selectedYear,
  setSelectedYear,
}: {
  selectedTime: string | undefined;
  setSelectedTime: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedYear: string | undefined;
  setSelectedYear: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const { user } = useUserStore();

  const getYearOptions = (
    startYear = 2021,
  ): { label: string; value: string }[] => {
    const currentYear = new Date().getFullYear();
    const options = [];

    for (let year = startYear; year <= currentYear; year++) {
      options.push({
        label: `${year}`,
        value: `${year}`,
      });
    }

    return options;
  };

  return (
    <div className="font-quicksand text-base-black flex items-center gap-4 px-4 text-left text-base leading-[100%] font-bold tracking-[0%] lg:px-8">
      <Avatar className="size-[60px]">
        <AvatarImage src={user?.profilePicture || ""} alt={user?.name} />
        <AvatarFallback className="bg-base-blue-cream text-2xl font-medium">
          {(
            (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "") || "N/A"
          ).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="grid flex-1 gap-1 text-left leading-tight">
        <h1 className="truncate">Hello, Mr. {user?.name}</h1>
        <p className="text-base-gray truncate font-medium">
          Welcome to Limospro Dashboard
        </p>
      </div>

      <Button
        onClick={() => {
          setSelectedTime("");
          setSelectedYear("");
        }}
        type="button"
        variant={"outlineSecondary"}
      >
        <IconFilterX /> <span>Clear Filter</span>
      </Button>

      <SelectDropDown
        placeholder="Select Year"
        items={getYearOptions()}
        value={selectedYear}
        setSelectedItem={setSelectedYear}
        onChange={() => setSelectedTime("")}
      />

      <SelectDropDown
        placeholder="Select Time"
        items={[
          { label: "Weekly", value: "weekly" },
          { label: "Monthly", value: "monthly" },
          { label: "Quarterly", value: "quarterly" },
          { label: "6 Months", value: "6_months" },
          { label: "Yearly", value: "yearly" },
        ]}
        value={selectedTime}
        setSelectedItem={(value) => setSelectedTime(value)}
        onChange={() => setSelectedYear("")}
      />
    </div>
  );
}

export default UserProfile;
