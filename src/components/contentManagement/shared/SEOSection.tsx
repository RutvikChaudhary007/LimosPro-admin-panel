import { X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { AutoCompleteInput } from "@/components/AutoCompleteInput";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { SelectDropDown } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import UploadWithUrlV2 from "@/components/ui/upload-with-url-v2";

interface SEOSectionProps {
  form: UseFormReturn<any>;
  selectedLanguage?: string; // Optional for shared SEO
  metaKeywordsData?: { metaKeywords?: { keyword: string }[] };
  keywordSuggestions?: string[];
  basePath?: string; // e.g., "seo"
}

export const SEOSection: React.FC<SEOSectionProps> = ({
  form,
  selectedLanguage,
  metaKeywordsData,
  keywordSuggestions = [],
  basePath = "seo",
}) => {
  const { control, register } = form;
  const [keywordInput, setKeywordInput] = useState("");

  // If selectedLanguage is provided, append it. Otherwise use basePath as is.
  const seoPath = selectedLanguage
    ? `${basePath}.${selectedLanguage}`
    : basePath;
  const langTitle = selectedLanguage
    ? `(${selectedLanguage.toUpperCase()})`
    : "(Shared)";

  return (
    <div className="space-y-6">
      {/* Basic SEO */}
      <Card>
        <CardBody>
          <CardHeader>
            <CardTitle>Basic SEO {langTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field>
              <FieldLabel>Meta Title</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...register(`${seoPath}.metaTitle`)}
                  placeholder="Page title for search engines"
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel>Meta Description</FieldLabel>
              <Textarea
                {...register(`${seoPath}.metaDescription`)}
                placeholder="Brief summary of the page content"
              />
            </Field>

            <Field>
              <FieldLabel>Meta Keywords</FieldLabel>
              <Controller
                name={`${seoPath}.metaKeywords`}
                control={control}
                render={({ field }) => {
                  const keywords = Array.isArray(field.value)
                    ? field.value
                    : [];
                  const addKeyword = (kw: string) => {
                    if (!kw.trim() || keywords.includes(kw)) return;
                    field.onChange([...keywords, kw]);
                  };
                  const removeKeyword = (idx: number) => {
                    field.onChange(keywords.filter((_, i) => i !== idx));
                  };

                  return (
                    <div className="space-y-2">
                      <AutoCompleteInput
                        value={keywordInput}
                        setValue={setKeywordInput}
                        list={
                          metaKeywordsData?.metaKeywords?.map(
                            (k) => k.keyword,
                          ) || keywordSuggestions
                        }
                        onAdd={(kw) => {
                          addKeyword(kw);
                          setKeywordInput("");
                        }}
                        placeholder="Add keyword"
                        inputId={`keyword-input-${selectedLanguage || "shared"}`}
                      />
                      {keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {keywords.map((kw: string, i: number) => (
                            <Badge key={i} className="flex items-center gap-1">
                              {kw}
                              <X
                                className="size-3 cursor-pointer hover:text-red-500"
                                onClick={() => removeKeyword(i)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }}
              />
            </Field>

            <Field>
              <FieldLabel>Canonical URL</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...register(`${seoPath}.canonicalUrl`)}
                  placeholder="https://example.com/page"
                />
              </InputGroup>
            </Field>
          </CardContent>
        </CardBody>
      </Card>

      {/* Open Graph */}
      <Card>
        <CardBody>
          <CardHeader>
            <CardTitle>Open Graph (Social Sharing)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>OG Title</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...register(`${seoPath}.openGraph.title`)}
                    placeholder="Social media title"
                  />
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel>OG Type</FieldLabel>
                <Controller
                  name={`${seoPath}.openGraph.type`}
                  control={control}
                  render={({ field }) => (
                    <SelectDropDown
                      placeholder="Select type"
                      items={[
                        { value: "website", label: "Website" },
                        { value: "article", label: "Article" },
                        { value: "product", label: "Product" },
                        { value: "place", label: "Place" },
                      ]}
                      value={field.value}
                      setSelectedItem={field.onChange}
                    />
                  )}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>OG Description</FieldLabel>
              <Textarea
                {...register(`${seoPath}.openGraph.description`)}
                placeholder="Social media description"
              />
            </Field>

            <Field>
              <FieldLabel>OG URL</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...register(`${seoPath}.openGraph.url`)}
                  placeholder="Canonical social URL"
                />
              </InputGroup>
            </Field>

            <Controller
              name={`${seoPath}.openGraph.ogImage`}
              control={control}
              render={({ field }) => (
                <UploadWithUrlV2
                  value={field.value}
                  onChange={field.onChange}
                  title="Open Graph Image"
                />
              )}
            />
          </CardContent>
        </CardBody>
      </Card>

      {/* Twitter Card */}
      <Card>
        <CardBody>
          <CardHeader>
            <CardTitle>Twitter Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Twitter Title</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...register(`${seoPath}.twitter.title`)}
                    placeholder="Twitter post title"
                  />
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel>Twitter Card Type</FieldLabel>
                <Controller
                  name={`${seoPath}.twitter.card`}
                  control={control}
                  render={({ field }) => (
                    <SelectDropDown
                      placeholder="Select card type"
                      items={[
                        { value: "summary", label: "Summary" },
                        {
                          value: "summary_large_image",
                          label: "Summary Large Image",
                        },
                        { value: "app", label: "App" },
                        { value: "player", label: "Player" },
                      ]}
                      value={field.value}
                      setSelectedItem={field.onChange}
                    />
                  )}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>Twitter Description</FieldLabel>
              <Textarea
                {...register(`${seoPath}.twitter.description`)}
                placeholder="Twitter post description"
              />
            </Field>

            <Controller
              name={`${seoPath}.twitter.twitterImage`}
              control={control}
              render={({ field }) => (
                <UploadWithUrlV2
                  value={field.value}
                  onChange={field.onChange}
                  title="Twitter Image"
                />
              )}
            />
          </CardContent>
        </CardBody>
      </Card>
    </div>
  );
};
