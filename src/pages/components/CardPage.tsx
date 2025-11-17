import { IconEyeOff, IconLock, IconMail } from "@tabler/icons-react";
import { TrendingDown } from "lucide-react";
import IconChevronDown from "@/assets/Icons/ic-chevron-down.svg?react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardFooter,
  CardHeader,
  CardImage,
  CardTitle,
  MetricCard,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

function CardPage() {
  return (
    <div className="p-2 space-y-4">
      {/* Matric Card Component [Dashboard] */}
      <div className="flex gap-4 w-full p-2">
        <MetricCard
          title="Total Revenue"
          value="$45,231.89"
          percentage="5.2%"
        />

        <MetricCard title="New Customers" value="1,204" percentage="3.8%" />

        <MetricCard
          title="Refunds"
          value="$231.00"
          percentage="-1.1%"
          icon={<TrendingDown />}
        />

        <MetricCard
          title="Refunds"
          value="$231.00"
          percentage="-1.1%"
          icon={<TrendingDown />}
        />
      </div>
      <div className=" space-y-4">
        {/* Card Component */}
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Noteworthy technology acquisitions 2021</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Here are the biggest enterprise technology acquisitions of 2021
                so far, in reverse chronological order.
              </p>
            </CardContent>
          </CardBody>
        </Card>
        {/* Card With Button */}
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Noteworthy technology acquisitions 2021</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Here are the biggest enterprise technology acquisitions of 2021
                so far, in reverse chronological order.
              </p>
            </CardContent>
            <CardFooter>
              <Button>
                <IconChevronDown />
                <span>Button Title</span>
                <IconChevronDown />
              </Button>
            </CardFooter>
          </CardBody>
        </Card>
        {/* Card With Image */}
        <Card>
          <CardImage
            src="https://placehold.co/549x200"
            className="w-full h-[200px]"
            alt="Tech"
          />
          <CardBody>
            <CardHeader>
              <CardTitle>Noteworthy technology acquisitions 2021</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Here are the biggest enterprise technology acquisitions of 2021
                so far, in reverse chronological order.
              </p>
            </CardContent>
            <CardFooter>
              <Button>
                <IconChevronDown />
                <span>Button Title</span>
                <IconChevronDown />
              </Button>
            </CardFooter>
          </CardBody>
        </Card>
        {/* Card With Image horizontal Card */}
        <Card variant="horizontal">
          <CardImage
            src="https://placehold.co/200x250"
            className="w-[200px]"
            alt="Tech"
          />
          <CardBody>
            <CardHeader>
              <CardTitle>Noteworthy technology acquisitions 2021</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Here are the biggest enterprise technology acquisitions of 2021
                so far, in reverse chronological order.
              </p>
            </CardContent>
            <CardFooter>
              <Button>
                <IconChevronDown />
                <span>Button Title</span>
                <IconChevronDown />
              </Button>
            </CardFooter>
          </CardBody>
        </Card>
      </div>
      <div className="">
        {/* Profile Card */}
        <Card className="p-10">
          <CardImage
            src="https://placehold.co/120"
            alt="Tech"
            className="w-30 h-30 mx-auto mb-2 rounded-full"
          />
          <CardBody className="p-0 items-center text-center gap-6">
            <CardContent className="space-y-1">
              <CardTitle>Bonnie Green</CardTitle>
              <p>Visual Designer</p>
            </CardContent>
            <CardFooter className="flex w-full justify-center gap-6 flex-wrap">
              <Button size="sm" spacing="sm" className="p-2 h-9">
                <span>Add Friend</span>
              </Button>
              <Button
                variant="outlinePrimary"
                size="sm"
                spacing="sm"
                className="p-2 h-9"
              >
                <span>Message</span>
              </Button>
            </CardFooter>
          </CardBody>
        </Card>
      </div>
      <div className="">
        {/* Empty Card */}
        <Card>
          <CardBody>
            <form>
              <CardTitle>Sign in to our platform</CardTitle>
              <div className="space-y-4 my-4">
                <Field>
                  <FieldLabel htmlFor="email" className="text-base-black gap-0">
                    Email Address
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="email"
                      type="email"
                      placeholder="Email Address"
                      required
                    />
                    <InputGroupAddon>
                      <IconMail />
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription className="mt-1 ">
                    Provide your full name here.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel
                    htmlFor="password"
                    className="text-base-black gap-0"
                  >
                    Password
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="password"
                      type="password"
                      placeholder="Password"
                      required
                    />
                    <InputGroupAddon>
                      <IconLock />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      <IconEyeOff />
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription className="mt-1 ">
                    Please insert minimum 8 characters.
                  </FieldDescription>
                </Field>
              </div>
              <CardFooter>
                <Button type="submit">
                  <span>Login to Account</span>
                </Button>
              </CardFooter>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default CardPage;
