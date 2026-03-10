import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFetchCountryPageById,
  useUpdateCountryPage,
} from "@/api/pages/countryPage.api";
import {
  useFetchRoutePageById,
  useUpdateRoutePage,
} from "@/api/pages/routesPage.api";
import { ErrorCard } from "@/components/common/ErrorCard";
import CitiesPageForm from "@/components/contentManagement/routes/CitiesPageForm";
import CityRoutesForm from "@/components/contentManagement/routes/CityRoutesForm";
import CountriesPageForm from "@/components/contentManagement/routes/CountriesPageForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";

export default function EditPage() {
  const { id, category } = useParams<{ id: string; category: string }>();
  const navigate = useNavigate();

  const categoryLower = category?.toLowerCase() ?? "";

  // Fetch data based on category - both hooks are called but only one will have data
  const routePageQuery = useFetchRoutePageById(id ?? "");
  const countryPageQuery = useFetchCountryPageById(id ?? "");

  const routeUpdateMutation = useUpdateRoutePage();
  const countryUpdateMutation = useUpdateCountryPage();

  // Select correct data and mutation based on category
  const isCountriesCategory = categoryLower === "countries";
  const data = isCountriesCategory
    ? countryPageQuery.data
    : routePageQuery.data;
  const isFetching = isCountriesCategory
    ? countryPageQuery.isFetching
    : routePageQuery.isFetching;
  const isError = isCountriesCategory
    ? countryPageQuery.isError
    : routePageQuery.isError;
  const refetch = isCountriesCategory
    ? countryPageQuery.refetch
    : routePageQuery.refetch;
  const updateMutation = isCountriesCategory
    ? countryUpdateMutation
    : routeUpdateMutation;

  const handleSubmit = (formData: FormData) => {
    if (!id) return;
    toastPromise(
      updateMutation.mutateAsync({ id, data: formData }) as Promise<unknown>,
      {
        loading: "Updating page...",
        success: () => {
          navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
          return "Page updated successfully!";
        },
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.message || "Failed to update page"
            : "Failed to update page",
      },
    );
  };

  const title =
    categoryLower === "cityroutes"
      ? "Edit City-to-City Routes Page"
      : categoryLower === "countries"
        ? "Edit Countries Page"
        : categoryLower === "cities"
          ? "Edit Cities Page"
          : "Edit Page";

  if (isError) return <ErrorCard refetch={refetch} />;

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title={title}
        breadcrumbs={[
          { label: "Home", path: "/" },
          {
            label: "Content Management",
            path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          },
          { label: title },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
        }}
      />
      {isFetching ? (
        <Spinner />
      ) : (
        <>
          {categoryLower === "cityroutes" && (
            <CityRoutesForm
              initialData={data}
              onSubmit={handleSubmit}
              type="Update"
            />
          )}
          {categoryLower === "countries" && (
            <CountriesPageForm
              initialData={data}
              onSubmit={handleSubmit}
              type="Update"
            />
          )}
          {categoryLower === "cities" && (
            <CitiesPageForm
              initialData={data}
              onSubmit={handleSubmit}
              type="Update"
            />
          )}
          {categoryLower !== "cityroutes" &&
            categoryLower !== "countries" &&
            categoryLower !== "cities" && (
              <CityRoutesForm
                initialData={data}
                onSubmit={handleSubmit}
                type="Update"
              />
            )}
        </>
      )}
    </div>
  );
}
