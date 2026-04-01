import type * as React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useFetchSiteSettingsUI,
  useUpdateSiteSettingsUIMutation,
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import UploadWithUrlV2 from "@/components/ui/upload-with-url-v2";

const defaultValues = {
  siteName: "Luxury Chauffeur Service",
  siteDescription: "Premium transportation services",
  maintenanceMode: false,
  defaultCommissionRate: "15",
  baseFee: "20",
  perMile: "2.5",
  minimumFare: "35",
  surgePeakHours: "1.2",
  surgeHolidays: "1.5",
  supportEmail: "support@limospro.com",
  contactPhone: "+1-555-0123",
  address: "123 Luxury Way, Beverly Hills, CA",
  defaultCurrency: "USD",
  timezone: "America/Los_Angeles",
  headerLogoUrl: "https://example.com/logo-1.png",
  footerLogoUrl: "https://example.com/logo-white.png",
  faviconUrl: "https://example.com/favicon.ico",
  logoAltText: "LimosPro Logo",
  stripeEnabled: true,
  stripePublicKey: "pk_test_...",
  taxRate: "8.5",
  platformFee: "5",
  gratuityRate: "10",
  openaiEnabled: true,
  openaiApiKey: "sk-...",
  modelName: "gpt-4o",
  maxTokens: "2000",
  temperature: "0.7",
  firebaseApiKey: "AIzaSy...",
  firebaseAuthDomain: "limospro.firebaseapp.com",
  firebaseProjectId: "limospro-app",
  firebaseStorageBucket: "limospro.appspot.com",
  firebaseMessagingSenderId: "1234567890",
  firebaseAppId: "1:1234567890:web:abcdef123456",
  googleMapsApiKey: "",
};

type SiteSettingsValues = typeof defaultValues & {
  headerLogoUrl: File | string;
  footerLogoUrl: File | string;
  faviconUrl: File | string;
};

const isFile = (value: unknown): value is File => value instanceof File;

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const SiteSettingsForm = () => {
  const [values, setValues] = useState<SiteSettingsValues>(defaultValues);
  const { data: siteSettings, isLoading } = useFetchSiteSettingsUI();
  const { mutate: updateSiteSettings, isPending } =
    useUpdateSiteSettingsUIMutation();
  const normalizedSettings =
    (siteSettings as { flat?: Partial<SiteSettingsValues> } | null)?.flat ??
    siteSettings;

  useEffect(() => {
    if (!normalizedSettings) return;
    setValues((prev) => ({ ...prev, ...normalizedSettings }));
  }, [normalizedSettings]);

  const updateValue =
    (key: keyof SiteSettingsValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const updateToggle =
    (key: keyof SiteSettingsValues) => (checked: boolean) => {
      setValues((prev) => ({ ...prev, [key]: checked }));
    };

  const updateUploadValue =
    (key: keyof SiteSettingsValues) =>
    (value?: File | string | Array<File | string>) => {
      const nextValue = Array.isArray(value) ? value[0] : value;
      setValues((prev) => ({ ...prev, [key]: nextValue ?? "" }));
    };

  // const buildPayload = (currentValues: SiteSettingsValues) => {
  //   const allowedKeys = normalizedSettings
  //     ? new Set(Object.keys(normalizedSettings as Record<string, unknown>))
  //     : null;
  //   const entries = Object.entries(currentValues).filter(
  //     ([key]) => !allowedKeys || allowedKeys.has(key),
  //   );
  //   const hasFile = entries.some(([, value]) => isFile(value));
  //   if (!hasFile) {
  //     return Object.fromEntries(entries) as SiteSettingsValues;
  //   }

  //   const formData = new FormData();
  //   entries.forEach(([key, value]) => {
  //     if (isFile(value)) {
  //       formData.append(key, value);
  //     } else {
  //       formData.append(key, String(value ?? ""));
  //     }
  //   });
  //   return formData;
  // };

  const buildPayload = (currentValues: SiteSettingsValues) => {
    const hasFile = Object.values(currentValues).some(isFile);
    if (!hasFile) return currentValues;

    const formData = new FormData();

    if (isFile(currentValues.headerLogoUrl)) {
      formData.append("headerLogo", currentValues.headerLogoUrl);
    }
    if (isFile(currentValues.footerLogoUrl)) {
      formData.append("footerLogo", currentValues.footerLogoUrl);
    }
    if (isFile(currentValues.faviconUrl)) {
      formData.append("favicon", currentValues.faviconUrl);
    }

    formData.append(
      "branding",
      JSON.stringify({
        headerLogoUrl: isFile(currentValues.headerLogoUrl)
          ? undefined
          : currentValues.headerLogoUrl,
        footerLogoUrl: isFile(currentValues.footerLogoUrl)
          ? undefined
          : currentValues.footerLogoUrl,
        faviconUrl: isFile(currentValues.faviconUrl)
          ? undefined
          : currentValues.faviconUrl,
        logoAltText: currentValues.logoAltText,
      }),
    );

    return formData;
  };

  const validateValues = (currentValues: SiteSettingsValues) => {
    const requiredFields: Array<{
      key: keyof SiteSettingsValues;
      label: string;
    }> = [
      { key: "siteName", label: "Site Name" },
      { key: "siteDescription", label: "Site Description" },
      { key: "supportEmail", label: "Support Email" },
      { key: "contactPhone", label: "Contact Phone" },
      { key: "address", label: "Address" },
      { key: "defaultCurrency", label: "Default Currency" },
      { key: "timezone", label: "Timezone" },
      { key: "googleMapsApiKey", label: "Google Maps API Key" },
    ];

    for (const field of requiredFields) {
      if (!String(currentValues[field.key] ?? "").trim()) {
        toast.error(`${field.label} is required.`);
        return false;
      }
    }

    if (!isValidEmail(String(currentValues.supportEmail))) {
      toast.error("Support email must be valid.");
      return false;
    }

    if (currentValues.stripeEnabled && !currentValues.stripePublicKey.trim()) {
      toast.error("Stripe public key is required when Stripe is enabled.");
      return false;
    }

    if (currentValues.openaiEnabled && !currentValues.openaiApiKey.trim()) {
      toast.error("OpenAI API key is required when OpenAI is enabled.");
      return false;
    }

    const numericFields: Array<{
      key: keyof SiteSettingsValues;
      label: string;
    }> = [
      { key: "defaultCommissionRate", label: "Default Commission Rate" },
      { key: "baseFee", label: "Base Fee" },
      { key: "perMile", label: "Per Mile" },
      { key: "minimumFare", label: "Minimum Fare" },
      { key: "surgePeakHours", label: "Surge Peak Hours" },
      { key: "surgeHolidays", label: "Surge Holidays" },
      { key: "taxRate", label: "Tax Rate" },
      { key: "maxTokens", label: "Max Tokens" },
      { key: "temperature", label: "Temperature" },
      { key: "gratuityRate", label: "Gratuity Rate" },
    ];

    for (const field of numericFields) {
      const value = Number(currentValues[field.key]);
      if (Number.isNaN(value)) {
        toast.error(`${field.label} must be a valid number.`);
        return false;
      }
      if (value < 0) {
        toast.error(`${field.label} must be 0 or greater.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateValues(values)) return;
    const payload = buildPayload(values);
    updateSiteSettings(payload, {
      onSuccess: () => {
        toast.success("Site settings updated.");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to update site settings.",
        );
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 gap-2 font-montserrat md:grid-cols-3 xl:grid-cols-7">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="firebase">Integration</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardBody>
              <CardHeader className="space-y-2">
                <CardTitle>General</CardTitle>
                <CardDescription>
                  Core identity and availability.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="siteName">Site Name</FieldLabel>
                    <Input
                      id="siteName"
                      value={values.siteName}
                      onChange={updateValue("siteName")}
                    />
                    <FieldDescription>Primary brand name.</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="siteDescription">
                      Site Description
                    </FieldLabel>
                    <Textarea
                      id="siteDescription"
                      value={values.siteDescription}
                      onChange={updateValue("siteDescription")}
                    />
                    <FieldDescription>
                      Short public description.
                    </FieldDescription>
                  </Field>
                  <Field orientation="horizontal" className="items-center">
                    <FieldLabel>Maintenance Mode</FieldLabel>
                    <Switch
                      checked={values.maintenanceMode}
                      onCheckedChange={updateToggle("maintenanceMode")}
                    />
                    <FieldDescription>
                      Enable to pause bookings and show a maintenance banner.
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isPending || isLoading}>
                  {isPending ? "Saving..." : "Save General"}
                </Button>
              </CardFooter>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardBody>
              <CardHeader className="space-y-2">
                <CardTitle>Pricing</CardTitle>
                <CardDescription>
                  Defaults used when creating new rates.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="defaultCommissionRate">
                    Default Commission Rate (%)
                  </FieldLabel>
                  <Input
                    id="defaultCommissionRate"
                    type="number"
                    value={values.defaultCommissionRate}
                    onChange={updateValue("defaultCommissionRate")}
                  />
                  <FieldDescription>
                    Partner commission baseline.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="baseFee">Base Fee</FieldLabel>
                  <Input
                    id="baseFee"
                    type="number"
                    value={values.baseFee}
                    onChange={updateValue("baseFee")}
                  />
                  <FieldDescription>Fixed starting cost.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="perMile">Per Mile</FieldLabel>
                  <Input
                    id="perMile"
                    type="number"
                    value={values.perMile}
                    onChange={updateValue("perMile")}
                  />
                  <FieldDescription>Distance multiplier.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="minimumFare">Minimum Fare</FieldLabel>
                  <Input
                    id="minimumFare"
                    type="number"
                    value={values.minimumFare}
                    onChange={updateValue("minimumFare")}
                  />
                  <FieldDescription>Lowest allowed fare.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="surgePeakHours">
                    Surge Peak Hours
                  </FieldLabel>
                  <Input
                    id="surgePeakHours"
                    type="number"
                    value={values.surgePeakHours}
                    onChange={updateValue("surgePeakHours")}
                  />
                  <FieldDescription>
                    Multiplier for peak traffic.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="surgeHolidays">
                    Surge Holidays
                  </FieldLabel>
                  <Input
                    id="surgeHolidays"
                    type="number"
                    value={values.surgeHolidays}
                    onChange={updateValue("surgeHolidays")}
                  />
                  <FieldDescription>Holiday multiplier.</FieldDescription>
                </Field>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isPending || isLoading}>
                  {isPending ? "Saving..." : "Save Pricing"}
                </Button>
              </CardFooter>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="application">
          <Card>
            <CardBody>
              <CardHeader className="space-y-2">
                <CardTitle>Application</CardTitle>
                <CardDescription>
                  Customer support and localization.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="supportEmail">Support Email</FieldLabel>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={values.supportEmail}
                    onChange={updateValue("supportEmail")}
                  />
                  <FieldDescription>Primary support inbox.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="contactPhone">Contact Phone</FieldLabel>
                  <Input
                    id="contactPhone"
                    value={values.contactPhone}
                    onChange={updateValue("contactPhone")}
                  />
                  <FieldDescription>
                    Displayed on contact forms.
                  </FieldDescription>
                </Field>
                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <Textarea
                    id="address"
                    value={values.address}
                    onChange={updateValue("address")}
                  />
                  <FieldDescription>Office address or HQ.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="defaultCurrency">
                    Default Currency
                  </FieldLabel>
                  <Input
                    id="defaultCurrency"
                    value={values.defaultCurrency}
                    onChange={updateValue("defaultCurrency")}
                  />
                  <FieldDescription>Used for pricing display.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                  <Input
                    id="timezone"
                    value={values.timezone}
                    onChange={updateValue("timezone")}
                  />
                  <FieldDescription>
                    Default scheduler timezone.
                  </FieldDescription>
                </Field>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isPending || isLoading}>
                  {isPending ? "Saving..." : "Save Application"}
                </Button>
              </CardFooter>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardBody>
              <CardHeader className="space-y-2">
                <CardTitle>Branding</CardTitle>
                <CardDescription>
                  Logos and favicon for the site.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded border border-base-gray/40 bg-base-white p-4 shadow-sm">
                  <UploadWithUrlV2
                    title="Header Logo"
                    multiple={false}
                    value={values.headerLogoUrl}
                    onChange={updateUploadValue("headerLogoUrl")}
                  />
                </div>
                <div className="rounded border border-base-gray/40 bg-base-white p-4 shadow-sm">
                  <UploadWithUrlV2
                    title="Footer Logo"
                    multiple={false}
                    value={values.footerLogoUrl}
                    onChange={updateUploadValue("footerLogoUrl")}
                  />
                </div>
                <div className="rounded border border-base-gray/40 bg-base-white p-4 shadow-sm">
                  <UploadWithUrlV2
                    title="Favicon"
                    multiple={false}
                    value={values.faviconUrl}
                    onChange={updateUploadValue("faviconUrl")}
                  />
                </div>
                <div className="rounded border border-base-gray/40 bg-base-white p-4 shadow-sm">
                  <Field>
                    <FieldLabel htmlFor="logoAltText">Logo Alt Text</FieldLabel>
                    <Input
                      id="logoAltText"
                      value={values.logoAltText}
                      onChange={updateValue("logoAltText")}
                    />
                    <FieldDescription>
                      Accessible label for logos.
                    </FieldDescription>
                  </Field>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isPending || isLoading}>
                  {isPending ? "Saving..." : "Save Branding"}
                </Button>
              </CardFooter>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardBody>
              <CardHeader className="space-y-2">
                <CardTitle>Payment</CardTitle>
                <CardDescription>Gateways, taxes, and tips.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Field orientation="horizontal" className="items-center">
                    <FieldLabel>Stripe Enabled</FieldLabel>
                    <Switch
                      checked={values.stripeEnabled}
                      onCheckedChange={updateToggle("stripeEnabled")}
                    />
                    <FieldDescription>Enable Stripe gateway.</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="stripePublicKey">
                      Stripe Public Key
                    </FieldLabel>
                    <Input
                      id="stripePublicKey"
                      value={values.stripePublicKey}
                      onChange={updateValue("stripePublicKey")}
                    />
                    <FieldDescription>Public publishable key.</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="taxRate">Tax Rate (%)</FieldLabel>
                    <Input
                      id="taxRate"
                      type="number"
                      value={values.taxRate}
                      onChange={updateValue("taxRate")}
                    />
                    <FieldDescription>Applied at checkout.</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="platformFee">
                      Platform Fee (%)
                    </FieldLabel>
                    <Input
                      id="platformFee"
                      type="number"
                      value={values.platformFee}
                      onChange={updateValue("platformFee")}
                    />
                    <FieldDescription>
                      Platform fee deducted per transaction.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="gratuityRate">
                      Gratuity Rate (%)
                    </FieldLabel>
                    <Input
                      id="gratuityRate"
                      type="number"
                      value={values.gratuityRate}
                      onChange={updateValue("gratuityRate")}
                    />
                    <FieldDescription>
                      Default gratuity percentage for bookings.
                    </FieldDescription>
                  </Field>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isPending || isLoading}>
                  {isPending ? "Saving..." : "Save Payment"}
                </Button>
              </CardFooter>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="firebase">
          <Card>
            <CardBody>
              <CardHeader className="space-y-2">
                <CardTitle>Integration</CardTitle>
                <CardDescription>
                  Client keys for third-party services.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="googleMapsApiKey">
                    Google Maps API Key
                  </FieldLabel>
                  <Input
                    id="googleMapsApiKey"
                    value={values.googleMapsApiKey}
                    onChange={updateValue("googleMapsApiKey")}
                  />
                  <FieldDescription>Used for map services.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="firebaseApiKey">
                    Firebase API Key
                  </FieldLabel>
                  <Input
                    id="firebaseApiKey"
                    value={values.firebaseApiKey}
                    onChange={updateValue("firebaseApiKey")}
                  />
                  <FieldDescription>Project API key.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="firebaseAuthDomain">
                    Auth Domain
                  </FieldLabel>
                  <Input
                    id="firebaseAuthDomain"
                    value={values.firebaseAuthDomain}
                    onChange={updateValue("firebaseAuthDomain")}
                  />
                  <FieldDescription>
                    Auth domain for the project.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="firebaseProjectId">
                    Project ID
                  </FieldLabel>
                  <Input
                    id="firebaseProjectId"
                    value={values.firebaseProjectId}
                    onChange={updateValue("firebaseProjectId")}
                  />
                  <FieldDescription>Firebase project ID.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="firebaseStorageBucket">
                    Storage Bucket
                  </FieldLabel>
                  <Input
                    id="firebaseStorageBucket"
                    value={values.firebaseStorageBucket}
                    onChange={updateValue("firebaseStorageBucket")}
                  />
                  <FieldDescription>Storage bucket URL.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="firebaseMessagingSenderId">
                    Messaging Sender ID
                  </FieldLabel>
                  <Input
                    id="firebaseMessagingSenderId"
                    value={values.firebaseMessagingSenderId}
                    onChange={updateValue("firebaseMessagingSenderId")}
                  />
                  <FieldDescription>
                    Cloud messaging sender ID.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="firebaseAppId">App ID</FieldLabel>
                  <Input
                    id="firebaseAppId"
                    value={values.firebaseAppId}
                    onChange={updateValue("firebaseAppId")}
                  />
                  <FieldDescription>Firebase app identifier.</FieldDescription>
                </Field>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isPending || isLoading}>
                  {isPending ? "Saving..." : "Save Integration"}
                </Button>
              </CardFooter>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardBody>
              <CardHeader className="space-y-2">
                <CardTitle>AI Settings</CardTitle>
                <CardDescription>
                  Machine learning configuration.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <Field orientation="horizontal" className="items-center">
                  <FieldLabel>OpenAI Enabled</FieldLabel>
                  <Switch
                    checked={values.openaiEnabled}
                    onCheckedChange={updateToggle("openaiEnabled")}
                  />
                  <FieldDescription>Enable AI assistance.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="openaiApiKey">OpenAI API Key</FieldLabel>
                  <Input
                    id="openaiApiKey"
                    value={values.openaiApiKey}
                    onChange={updateValue("openaiApiKey")}
                  />
                  <FieldDescription>
                    Store securely in backend.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="modelName">Model Name</FieldLabel>
                  <Input
                    id="modelName"
                    value={values.modelName}
                    onChange={updateValue("modelName")}
                  />
                  <FieldDescription>Default AI model.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="maxTokens">Max Tokens</FieldLabel>
                  <Input
                    id="maxTokens"
                    type="number"
                    value={values.maxTokens}
                    onChange={updateValue("maxTokens")}
                  />
                  <FieldDescription>Token limit per request.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="temperature">Temperature</FieldLabel>
                  <Input
                    id="temperature"
                    type="number"
                    value={values.temperature}
                    onChange={updateValue("temperature")}
                  />
                  <FieldDescription>Creativity level.</FieldDescription>
                </Field>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isPending || isLoading}>
                  {isPending ? "Saving..." : "Save AI"}
                </Button>
              </CardFooter>
            </CardBody>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default SiteSettingsForm;
