import { Plus, Trash2 } from "lucide-react";
import type * as React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type CityDistanceLimits,
  useFetchGlobalLimits,
  useUpdateGlobalLimitsMutation,
} from "@/api/siteSetting.api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface GlobalLimitsValues {
  maxBookingsPerDay: number;
  maxDistanceMiles: number;
  minBookingNoticeHours: number;
  maxPassengersPerVehicle: number;
  cityDistanceLimits: CityDistanceLimits;
}

const GlobalLimitsForm = () => {
  const [values, setValues] = useState<GlobalLimitsValues>({
    maxBookingsPerDay: 100,
    maxDistanceMiles: 500,
    minBookingNoticeHours: 2,
    maxPassengersPerVehicle: 8,
    cityDistanceLimits: { default: 50 },
  });
  const [newCityName, setNewCityName] = useState("");
  const [newCityLimit, setNewCityLimit] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { data: globalLimits, isLoading } = useFetchGlobalLimits();
  const { mutate: updateGlobalLimits, isPending } =
    useUpdateGlobalLimitsMutation();

  useEffect(() => {
    console.log("API Response:", globalLimits);
    if (globalLimits && isInitialLoad) {
      // Handle nested data structure from API (data.data or data)
      const responseData = globalLimits as any;
      const data = responseData.data ?? responseData;
      console.log("Parsed data:", data);

      setValues({
        maxBookingsPerDay: data.maxBookingsPerDay ?? 100,
        maxDistanceMiles: data.maxDistanceMiles ?? 500,
        minBookingNoticeHours: data.minBookingNoticeHours ?? 2,
        maxPassengersPerVehicle: data.maxPassengersPerVehicle ?? 8,
        cityDistanceLimits: data.cityDistanceLimits ?? { default: 50 },
      });
      setIsInitialLoad(false);
    }
  }, [globalLimits, isInitialLoad]);

  const updateValue =
    (key: keyof Omit<GlobalLimitsValues, "cityDistanceLimits">) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setValues((prev) => ({
        ...prev,
        [key]: value === "" ? "" : Number(value),
      }));
    };

  const updateCityLimit = (city: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      cityDistanceLimits: {
        ...prev.cityDistanceLimits,
        [city]: value === "" ? undefined : Number(value),
      },
    }));
  };

  const addNewCity = () => {
    console.log("addNewCity called", { newCityName, newCityLimit });

    if (!newCityName.trim()) {
      toast.error("City name is required");
      return;
    }
    if (!newCityLimit || Number(newCityLimit) <= 0) {
      toast.error("Valid distance limit is required");
      return;
    }

    const cityKey = newCityName.toLowerCase().trim().replace(/\s+/g, "-");
    console.log("Adding city:", cityKey, "with limit:", Number(newCityLimit));

    setValues((prev) => {
      const newState = {
        ...prev,
        cityDistanceLimits: {
          ...prev.cityDistanceLimits,
          [cityKey]: Number(newCityLimit),
        },
      };
      console.log("New state:", newState);
      return newState;
    });

    setNewCityName("");
    setNewCityLimit("");
    toast.success(`Added ${newCityName} with ${newCityLimit} miles limit`);
  };

  const removeCity = (cityKey: string) => {
    if (cityKey === "default") {
      toast.error("Cannot remove default limit");
      return;
    }

    setValues((prev) => {
      const newLimits = { ...prev.cityDistanceLimits };
      delete newLimits[cityKey];
      return {
        ...prev,
        cityDistanceLimits: newLimits,
      };
    });
  };

  const validateValues = (): boolean => {
    if (Number(values.maxBookingsPerDay) < 1) {
      toast.error("Max bookings per day must be at least 1");
      return false;
    }
    if (Number(values.maxDistanceMiles) < 1) {
      toast.error("Max distance miles must be at least 1");
      return false;
    }
    if (Number(values.minBookingNoticeHours) < 0) {
      toast.error("Min booking notice hours cannot be negative");
      return false;
    }
    if (Number(values.maxPassengersPerVehicle) < 1) {
      toast.error("Max passengers per vehicle must be at least 1");
      return false;
    }
    if (
      !values.cityDistanceLimits.default ||
      values.cityDistanceLimits.default < 1
    ) {
      toast.error(
        "Default city distance limit is required and must be at least 1 mile",
      );
      return false;
    }
    return true;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateValues()) return;

    const payload = {
      maxBookingsPerDay: Number(values.maxBookingsPerDay),
      maxDistanceMiles: Number(values.maxDistanceMiles),
      minBookingNoticeHours: Number(values.minBookingNoticeHours),
      maxPassengersPerVehicle: Number(values.maxPassengersPerVehicle),
      cityDistanceLimits: values.cityDistanceLimits,
    };

    console.log("Submitting payload:", payload);
    console.log("City limits being sent:", values.cityDistanceLimits);

    updateGlobalLimits(payload, {
      onSuccess: (data) => {
        console.log("Success response:", data);
        toast.success("Global limits updated successfully.");
      },
      onError: (error: any) => {
        console.error("Error response:", error);
        toast.error(
          error?.response?.data?.message || "Failed to update global limits.",
        );
      },
    });
  };

  const sortedCities = Object.entries(values.cityDistanceLimits).sort(
    ([a], [b]) => {
      if (a === "default") return -1;
      if (b === "default") return 1;
      return a.localeCompare(b);
    },
  );

  console.log("sortedCities:", sortedCities);
  console.log("values.cityDistanceLimits:", values.cityDistanceLimits);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardBody>
          <CardHeader className="space-y-2">
            <CardTitle>City Distance Limits</CardTitle>
            <CardDescription>
              Configure maximum ride distances per city. Rides exceeding these
              limits for non-CityToCity services will show an error.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Global Settings */}
            <div className="grid gap-6 md:grid-cols-2 border-b pb-6">
              <Field>
                <FieldLabel htmlFor="maxBookingsPerDay">
                  Max Bookings Per Day
                </FieldLabel>
                <Input
                  id="maxBookingsPerDay"
                  type="number"
                  value={values.maxBookingsPerDay}
                  onChange={updateValue("maxBookingsPerDay")}
                />
                <FieldDescription>
                  Maximum bookings allowed per day globally.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="maxDistanceMiles">
                  Max Distance Miles (Global)
                </FieldLabel>
                <Input
                  id="maxDistanceMiles"
                  type="number"
                  value={values.maxDistanceMiles}
                  onChange={updateValue("maxDistanceMiles")}
                />
                <FieldDescription>
                  Absolute maximum distance allowed for any ride.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="minBookingNoticeHours">
                  Min Booking Notice (Hours)
                </FieldLabel>
                <Input
                  id="minBookingNoticeHours"
                  type="number"
                  value={values.minBookingNoticeHours}
                  onChange={updateValue("minBookingNoticeHours")}
                />
                <FieldDescription>
                  Minimum hours required between booking and pickup.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="maxPassengersPerVehicle">
                  Max Passengers Per Vehicle
                </FieldLabel>
                <Input
                  id="maxPassengersPerVehicle"
                  type="number"
                  value={values.maxPassengersPerVehicle}
                  onChange={updateValue("maxPassengersPerVehicle")}
                />
                <FieldDescription>
                  Maximum passengers allowed per vehicle.
                </FieldDescription>
              </Field>
            </div>

            {/* City Distance Limits */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                City-Specific Distance Limits
              </h3>
              <p className="text-sm text-gray-500">
                Set distance limits for each city. The "default" limit applies
                to all cities not listed.
              </p>

              <FieldGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedCities.map(([city, limit]) => (
                  <div
                    key={city}
                    className={`flex items-center gap-2 p-3 rounded-lg border ${
                      city === "default"
                        ? "bg-amber-50 border-amber-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex-1">
                      <label
                        htmlFor={`city-${city}`}
                        className="block text-sm font-medium capitalize"
                      >
                        {city === "default"
                          ? "🌍 Default (All Cities)"
                          : city.replace(/-/g, " ")}
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id={`city-${city}`}
                          type="number"
                          value={limit ?? ""}
                          onChange={(e) =>
                            updateCityLimit(city, e.target.value)
                          }
                          className="w-24 h-8"
                          min={1}
                        />
                        <span className="text-sm text-gray-500">miles</span>
                      </div>
                    </div>
                    {city !== "default" && (
                      <button
                        type="button"
                        onClick={() => removeCity(city)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded"
                        title="Remove city"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </FieldGroup>

              {/* Add New City */}
              <div className="flex items-end gap-2 pt-4 border-t">
                <div className="flex-1">
                  <label
                    htmlFor="new-city-name"
                    className="block text-sm font-medium mb-1"
                  >
                    Add New City
                  </label>
                  <Input
                    id="new-city-name"
                    placeholder="City name (e.g., miami)"
                    value={newCityName}
                    onChange={(e) => setNewCityName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="new-city-limit"
                    className="block text-sm font-medium mb-1"
                  >
                    Limit (miles)
                  </label>
                  <Input
                    id="new-city-limit"
                    type="number"
                    placeholder="50"
                    value={newCityLimit}
                    onChange={(e) => setNewCityLimit(e.target.value)}
                    className="w-32"
                    min={1}
                  />
                </div>
                <Button
                  type="button"
                  onClick={addNewCity}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending || isLoading}>
              {isPending ? "Saving..." : "Save Global Limits"}
            </Button>
          </CardFooter>
        </CardBody>
      </Card>
    </form>
  );
};

export default GlobalLimitsForm;
