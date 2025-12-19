import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import {
  LabeledEditor,
  LabeledInput,
} from "@/components/pagebuilder/partials/HelperComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { uid } from "@/utils/pagebuilder.utils";

// Schema for Home Page
const homeSchema = z.object({
  heroSectionHome: z
    .object({
      image: z.string().optional(),
      alt: z.string().optional(),
      h1: z.string().optional(),
      p: z.string().optional(),
    })
    .optional(),
  servicesOverview: z
    .object({
      paragraph: z.string().optional(),
      h2: z.string().optional(),
      description: z.string().optional(),
      serviceCards: z
        .array(
          z.object({
            id: z.string().optional(),
            src: z.string().optional(),
            alt: z.string().optional(),
            title: z.string().optional(),
            description: z.string().optional(),
            button: z.string().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
  whyChoose: z
    .object({
      paragraph: z.string().optional(),
      h2: z.string().optional(),
      description: z.string().optional(),
      infoCards: z
        .array(
          z.object({
            id: z.string().optional(),
            src: z.string().optional(),
            alt: z.string().optional(),
            title: z.string().optional(),
            description: z.string().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
  cityRoutes: z
    .object({
      paragraph: z.string().optional(),
      h2: z.string().optional(),
      description: z.string().optional(),
      cities: z
        .object({
          h3: z.string().optional(),
          link: z.string().optional(),
          cityCards: z
            .array(
              z.object({
                id: z.string().optional(),
                src: z.string().optional(),
                alt: z.string().optional(),
                title: z.string().optional(),
                description: z.string().optional(),
              }),
            )
            .optional(),
        })
        .optional(),
      routes: z
        .object({
          h3: z.string().optional(),
          link: z.string().optional(),
          routeCards: z
            .array(
              z.object({
                id: z.string().optional(),
                from: z.string().optional(),
                to: z.string().optional(),
                time: z.string().optional(),
                distance: z.string().optional(),
              }),
            )
            .optional(),
        })
        .optional(),
    })
    .optional(),
  findYours: z
    .object({
      heroSectionText: z
        .object({
          src: z.string().optional(),
          alt: z.string().optional(),
          height: z.string().optional(),
          gradient: z.string().optional(),
        })
        .optional(),
      p1: z.string().optional(),
      p2: z.string().optional(),
      description: z.string().optional(),
      btn1: z.string().optional(),
      btn2: z.string().optional(),
    })
    .optional(),
  safetyAndPrivacy: z
    .object({
      infoCards: z
        .array(
          z.object({
            id: z.string().optional(),
            src: z.string().optional(),
            alt: z.string().optional(),
            title: z.string().optional(),
            description: z.string().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
  corporateGroundTransportation: z
    .object({
      src: z.string().optional(),
      alt: z.string().optional(),
      t1: z.string().optional(),
      t2: z.string().optional(),
      description: z.string().optional(),
      imageLeft: z.boolean().optional(),
    })
    .optional(),
  meetingsAndSpecialEvents: z
    .object({
      imageLeft: z.boolean().optional(),
      src: z.string().optional(),
      alt: z.string().optional(),
      t1: z.string().optional(),
      t2: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  bookARide: z
    .object({
      h2: z.string().optional(),
      p: z.string().optional(),
      btn: z.string().optional(),
    })
    .optional(),
  downloadOptions: z
    .object({
      h2: z.string().optional(),
      p: z.string().optional(),
      appStoreLink: z.string().optional(),
      playStoreLink: z.string().optional(),
      image: z
        .object({
          src: z.string().optional(),
          alt: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  testimonial: z
    .object({
      testimonialCard: z
        .object({
          h2: z.string().optional(),
          Quote: z.string().optional(),
          Name: z.string().optional(),
          Position: z.string().optional(),
          src: z.string().optional(),
          alt: z.string().optional(),
        })
        .optional(),
      image: z
        .object({
          src: z.string().optional(),
          alt: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  ourPartners: z
    .object({
      p1: z.string().optional(),
      p2: z.string().optional(),
      images: z
        .array(
          z.object({
            id: z.string().optional(),
            src: z.string().optional(),
            alt: z.string().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
});

type HomeFormData = z.infer<typeof homeSchema>;

interface HomeFormProps {
  initialData?: any;
  onSubmit: (data: HomeFormData) => void;
  type: string;
}

export default function HomeForm({
  initialData,
  onSubmit,
  type,
}: HomeFormProps) {
  const form = useForm<HomeFormData>({
    resolver: zodResolver(homeSchema),
    defaultValues: initialData || {
      findYours: {
        heroSectionText: {
          src: "/HeroSections/hs-features.jpg",
          alt: "A Picture of a Luxury vehicle",
          height: "h-[60vh]",
          gradient: "bg-black/80",
        },
      },
    },
  });

  const { control, register, handleSubmit } = form;

  // Field Arrays
  const serviceCards = useFieldArray({
    control,
    name: "servicesOverview.serviceCards",
  });
  const wyChooseCards = useFieldArray({ control, name: "whyChoose.infoCards" });
  const cityCards = useFieldArray({
    control,
    name: "cityRoutes.cities.cityCards",
  });
  const routeCards = useFieldArray({
    control,
    name: "cityRoutes.routes.routeCards",
  });
  const safetyCards = useFieldArray({
    control,
    name: "safetyAndPrivacy.infoCards",
  });
  const partnerImages = useFieldArray({ control, name: "ourPartners.images" });

  const onHandleSubmit = (data: HomeFormData) => {
    console.log("Home Data:", data);
    onSubmit(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onHandleSubmit)} className="space-y-8">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section Home</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LabeledInput
              label="Hero Image URL"
              {...register("heroSectionHome.image")}
            />
            <LabeledInput
              label="Hero Image Alt"
              {...register("heroSectionHome.alt")}
            />
            <Controller
              control={control}
              name="heroSectionHome.h1"
              render={({ field }) => (
                <LabeledEditor
                  label="Heading (H1)"
                  value={field.value || ""}
                  onChange={field.onChange}
                  name={field.name}
                />
              )}
            />
            <Controller
              control={control}
              name="heroSectionHome.p"
              render={({ field }) => (
                <LabeledEditor
                  label="Content/Paragraph"
                  value={field.value || ""}
                  onChange={field.onChange}
                  name={field.name}
                />
              )}
            />
          </CardContent>
        </Card>

        {/* Services Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Services Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LabeledInput
              label="Paragraph"
              {...register("servicesOverview.paragraph")}
            />
            <LabeledInput
              label="Heading (H2)"
              {...register("servicesOverview.h2")}
            />
            <Controller
              control={control}
              name="servicesOverview.description"
              render={({ field }) => (
                <LabeledEditor
                  label="Rich Text (P)"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            <Separator />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Service Cards</h3>
                <Button
                  type="button"
                  onClick={() =>
                    serviceCards.append({
                      id: uid(),
                      src: "",
                      alt: "",
                      title: "",
                      description: "",
                      button: "",
                    })
                  }
                  variant="outlinePrimary"
                >
                  Add Service Card
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceCards.fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm text-gray-500 uppercase">
                          Card #{index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => serviceCards.remove(index)}
                        >
                          Remove
                        </Button>
                      </div>
                      <LabeledInput
                        label="Image URL"
                        {...register(
                          `servicesOverview.serviceCards.${index}.src`,
                        )}
                      />
                      <LabeledInput
                        label="Alt"
                        {...register(
                          `servicesOverview.serviceCards.${index}.alt`,
                        )}
                      />
                      <LabeledInput
                        label="Title"
                        {...register(
                          `servicesOverview.serviceCards.${index}.title`,
                        )}
                      />
                      <LabeledInput
                        label="Description"
                        {...register(
                          `servicesOverview.serviceCards.${index}.description`,
                        )}
                      />
                      <LabeledInput
                        label="Button Label"
                        {...register(
                          `servicesOverview.serviceCards.${index}.button`,
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose */}
        <Card>
          <CardHeader>
            <CardTitle>Why Choose</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LabeledInput
              label="Paragraph"
              {...register("whyChoose.paragraph")}
            />
            <LabeledInput label="Heading (H2)" {...register("whyChoose.h2")} />
            <Controller
              control={control}
              name="whyChoose.description"
              render={({ field }) => (
                <LabeledEditor
                  label="Rich Text (P)"
                  value={field.value || ""}
                  onChange={field.onChange}
                  name={field.name}
                />
              )}
            />
            <Separator />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Info Cards</h3>
                <Button
                  type="button"
                  onClick={() =>
                    wyChooseCards.append({
                      id: uid(),
                      src: "",
                      alt: "",
                      title: "",
                      description: "",
                    })
                  }
                  variant="outlinePrimary"
                >
                  Add Info Card
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wyChooseCards.fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm text-gray-500 uppercase">
                          Card #{index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => wyChooseCards.remove(index)}
                        >
                          Remove
                        </Button>
                      </div>
                      <LabeledInput
                        label="Image URL"
                        {...register(`whyChoose.infoCards.${index}.src`)}
                      />
                      <LabeledInput
                        label="Alt"
                        {...register(`whyChoose.infoCards.${index}.alt`)}
                      />
                      <LabeledInput
                        label="Title"
                        {...register(`whyChoose.infoCards.${index}.title`)}
                      />
                      <LabeledInput
                        label="Description"
                        {...register(
                          `whyChoose.infoCards.${index}.description`,
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* City Routes */}
        <Card>
          <CardHeader>
            <CardTitle>City Routes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LabeledInput
              label="Paragraph"
              {...register("cityRoutes.paragraph")}
            />
            <LabeledInput label="Heading (H2)" {...register("cityRoutes.h2")} />
            <Controller
              control={control}
              name="cityRoutes.description"
              render={({ field }) => (
                <LabeledEditor
                  label="Rich Text (P)"
                  value={field.value || ""}
                  onChange={field.onChange}
                  name={field.name}
                />
              )}
            />
            <Separator />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cities */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b pb-2">Cities</h3>
                <LabeledInput
                  label="Heading (H3)"
                  {...register("cityRoutes.cities.h3")}
                />
                <LabeledInput
                  label="Link"
                  {...register("cityRoutes.cities.link")}
                />
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-sm font-semibold">City Cards</h4>
                  <Button
                    type="button"
                    onClick={() =>
                      cityCards.append({
                        id: uid(),
                        src: "",
                        alt: "",
                        title: "",
                        description: "",
                      })
                    }
                    variant="outlinePrimary"
                    size="sm"
                  >
                    Add City Card
                  </Button>
                </div>
                <div className="space-y-4 mt-4">
                  {cityCards.fields.map((field, index) => (
                    <Card key={field.id}>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-sm text-gray-500 uppercase">
                            City #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => cityCards.remove(index)}
                          >
                            Remove
                          </Button>
                        </div>
                        <LabeledInput
                          label="Image URL"
                          {...register(
                            `cityRoutes.cities.cityCards.${index}.src`,
                          )}
                        />
                        <LabeledInput
                          label="Alt"
                          {...register(
                            `cityRoutes.cities.cityCards.${index}.alt`,
                          )}
                        />
                        <LabeledInput
                          label="Title"
                          {...register(
                            `cityRoutes.cities.cityCards.${index}.title`,
                          )}
                        />
                        <LabeledInput
                          label="Description"
                          {...register(
                            `cityRoutes.cities.cityCards.${index}.description`,
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Routes */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b pb-2">Routes</h3>
                <LabeledInput
                  label="Heading (H3)"
                  {...register("cityRoutes.routes.h3")}
                />
                <LabeledInput
                  label="Link"
                  {...register("cityRoutes.routes.link")}
                />
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-sm font-semibold">Route Cards</h4>
                  <Button
                    type="button"
                    onClick={() =>
                      routeCards.append({
                        id: uid(),
                        from: "",
                        to: "",
                        time: "",
                        distance: "",
                      })
                    }
                    variant="outlinePrimary"
                    size="sm"
                  >
                    Add Route Card
                  </Button>
                </div>
                <div className="space-y-4 mt-4">
                  {routeCards.fields.map((field, index) => (
                    <Card key={field.id}>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-sm text-gray-500 uppercase">
                            Route #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => routeCards.remove(index)}
                          >
                            Remove
                          </Button>
                        </div>
                        <LabeledInput
                          label="From"
                          {...register(
                            `cityRoutes.routes.routeCards.${index}.from`,
                          )}
                        />
                        <LabeledInput
                          label="To"
                          {...register(
                            `cityRoutes.routes.routeCards.${index}.to`,
                          )}
                        />
                        <LabeledInput
                          label="Time"
                          {...register(
                            `cityRoutes.routes.routeCards.${index}.time`,
                          )}
                        />
                        <LabeledInput
                          label="Distance"
                          {...register(
                            `cityRoutes.routes.routeCards.${index}.distance`,
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Find Yours */}
        <Card>
          <CardHeader>
            <CardTitle>Find Yours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
              <LabeledInput
                label="Hero Image URL"
                {...register("findYours.heroSectionText.src")}
              />
              <LabeledInput
                label="Alt Text"
                {...register("findYours.heroSectionText.alt")}
              />
              <LabeledInput
                label="Height"
                {...register("findYours.heroSectionText.height")}
              />
              <LabeledInput
                label="Gradient"
                {...register("findYours.heroSectionText.gradient")}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabeledInput label="Paragraph 1" {...register("findYours.p1")} />
              <LabeledInput label="Paragraph 2" {...register("findYours.p2")} />
              <LabeledInput label="Button 1" {...register("findYours.btn1")} />
              <LabeledInput label="Button 2" {...register("findYours.btn2")} />
            </div>
            <Controller
              control={control}
              name="findYours.description"
              render={({ field }) => (
                <LabeledEditor
                  label="Description (Rich Text)"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
          </CardContent>
        </Card>

        {/* Safety and Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Safety and Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Info Cards Secondary</h3>
              <Button
                type="button"
                onClick={() =>
                  safetyCards.append({
                    id: uid(),
                    src: "",
                    alt: "",
                    title: "",
                    description: "",
                  })
                }
                variant="outlinePrimary"
              >
                Add Safety Card
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safetyCards.fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm text-gray-500 uppercase">
                        Card #{index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => safetyCards.remove(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <LabeledInput
                      label="Image URL"
                      {...register(`safetyAndPrivacy.infoCards.${index}.src`)}
                    />
                    <LabeledInput
                      label="Alt"
                      {...register(`safetyAndPrivacy.infoCards.${index}.alt`)}
                    />
                    <LabeledInput
                      label="Title"
                      {...register(`safetyAndPrivacy.infoCards.${index}.title`)}
                    />
                    <LabeledInput
                      label="Description"
                      {...register(
                        `safetyAndPrivacy.infoCards.${index}.description`,
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Corporate Ground Transportation */}
        <Card>
          <CardHeader>
            <CardTitle>Corporate Ground Transportation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabeledInput
                label="Image URL"
                {...register("corporateGroundTransportation.src")}
              />
              <LabeledInput
                label="Alt Text"
                {...register("corporateGroundTransportation.alt")}
              />
              <LabeledInput
                label="Title Layer 1 (T1)"
                {...register("corporateGroundTransportation.t1")}
              />
              <LabeledInput
                label="Title Layer 2 (T2)"
                {...register("corporateGroundTransportation.t2")}
              />
            </div>
            <LabeledInput
              label="Description"
              {...register("corporateGroundTransportation.description")}
            />
            <LabeledInput
              type="checkbox"
              id="imageLeft"
              {...register("corporateGroundTransportation.imageLeft")}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              label="Show Image on Left?"
            />
          </CardContent>
        </Card>

        {/* Meetings and Special Events */}
        <Card>
          <CardHeader>
            <CardTitle>Meetings and Special Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabeledInput
                label="Image URL"
                {...register("meetingsAndSpecialEvents.src")}
              />
              <LabeledInput
                label="Alt Text"
                {...register("meetingsAndSpecialEvents.alt")}
              />
              <LabeledInput
                label="Title Layer 1 (T1)"
                {...register("meetingsAndSpecialEvents.t1")}
              />
              <LabeledInput
                label="Title Layer 2 (T2)"
                {...register("meetingsAndSpecialEvents.t2")}
              />
            </div>
            <LabeledInput
              label="Description"
              {...register("meetingsAndSpecialEvents.description")}
            />
            {/* <div className="flex items-center gap-2"> */}
            <LabeledInput
              type="checkbox"
              id="imageLeft"
              {...register("meetingsAndSpecialEvents.imageLeft")}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              label="Show Image on Left?"
            />
            {/* </div> */}
          </CardContent>
        </Card>

        {/* Book A Ride */}
        <Card>
          <CardHeader>
            <CardTitle>Book A Ride</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LabeledInput label="Heading (H2)" {...register("bookARide.h2")} />
            <LabeledInput label="Paragraph" {...register("bookARide.p")} />
            <LabeledInput label="Button Label" {...register("bookARide.btn")} />
          </CardContent>
        </Card>

        {/* Download Options */}
        <Card>
          <CardHeader>
            <CardTitle>Download Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LabeledInput
              label="Heading (H2)"
              {...register("downloadOptions.h2")}
            />
            <Controller
              control={control}
              name="downloadOptions.p"
              render={({ field }) => (
                <LabeledEditor
                  label="Rich Text (P)"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">App Store (iOS)</h4>
                <LabeledInput
                  label="App Store Link"
                  {...register("downloadOptions.appStoreLink")}
                />
                <img
                  src="/DownloadOptions/appstore.png"
                  alt="App Store preview"
                  className="h-10 object-contain brightness-75 opacity-50"
                />
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Play Store (Android)</h4>
                <LabeledInput
                  label="Play Store Link"
                  {...register("downloadOptions.playStoreLink")}
                />
                <img
                  src="/DownloadOptions/playstore.png"
                  alt="Play Store preview"
                  className="h-10 object-contain brightness-75 opacity-50"
                />
              </div>
            </div>
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold text-sm">Central/Large Image</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LabeledInput
                  label="Image URL"
                  {...register("downloadOptions.image.src")}
                />
                <LabeledInput
                  label="Alt Text"
                  {...register("downloadOptions.image.alt")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonial */}
        <Card>
          <CardHeader>
            <CardTitle>Testimonial Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-lg font-bold border-b pb-1">
                Testimonial Card
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <LabeledInput
                  label="Heading (H2)"
                  {...register("testimonial.testimonialCard.h2")}
                />
                <LabeledInput
                  label="Quote"
                  {...register("testimonial.testimonialCard.Quote")}
                />
                <LabeledInput
                  label="Author Name"
                  {...register("testimonial.testimonialCard.Name")}
                />
                <LabeledInput
                  label="Author Position"
                  {...register("testimonial.testimonialCard.Position")}
                />
                <LabeledInput
                  label="Author Image URL"
                  {...register("testimonial.testimonialCard.src")}
                />
                <LabeledInput
                  label="Author Image Alt"
                  {...register("testimonial.testimonialCard.alt")}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold border-b pb-1">
                Main Section Image
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LabeledInput
                  label="Image URL"
                  {...register("testimonial.image.src")}
                />
                <LabeledInput
                  label="Alt Text"
                  {...register("testimonial.image.alt")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Our Partners */}
        <Card>
          <CardHeader>
            <CardTitle>Our Partners</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabeledInput
                label="Paragraph 1"
                {...register("ourPartners.p1")}
              />
              <LabeledInput
                label="Paragraph 2"
                {...register("ourPartners.p2")}
              />
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Partner Logos/Images</h3>
                <Button
                  type="button"
                  onClick={() =>
                    partnerImages.append({ id: uid(), src: "", alt: "" })
                  }
                  variant="outlinePrimary"
                >
                  Add Partner Logo
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {partnerImages.fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm text-gray-500 uppercase">
                          Logo #{index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => partnerImages.remove(index)}
                        >
                          Remove
                        </Button>
                      </div>
                      <LabeledInput
                        label="Logo URL"
                        {...register(`ourPartners.images.${index}.src`)}
                      />
                      <LabeledInput
                        label="Alt Text"
                        {...register(`ourPartners.images.${index}.alt`)}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="sticky bottom-6 z-10 bg-white/80 backdrop-blur p-4 border rounded-xl shadow-lg flex justify-end gap-3">
          <Button
            type="button"
            variant="outlinePrimary"
            onClick={() => form.reset()}
          >
            Reset Form
          </Button>
          <Button type="submit">{type}</Button>
        </div>
      </form>
    </FormProvider>
  );
}
