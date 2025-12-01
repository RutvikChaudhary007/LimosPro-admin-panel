import IconChevronDown from "@/assets/Icons/ic-chevron-down.svg?react";
import { Button } from "@/components/ui/button";

function ButtonPage() {
  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="text-base-primary">
          {/* Primary Button Without Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Primary Button Without Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button spacing="default">
                <span>Button Default</span>
              </Button>
              <Button spacing="md">
                <span>Button MD</span>
              </Button>

              <Button spacing="sm">
                <span>Button SM</span>
              </Button>
            </div>
          </div>
          {/* Primary Button With Icons */}
          <div>
            <p className="mb-3 text-base font-medium">
              Primary Button With Icons
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button spacing="default">
                <IconChevronDown />
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button spacing="md">
                <IconChevronDown />
                <span>Button MD</span>
                <IconChevronDown />
              </Button>

              <Button size="sm" spacing="sm">
                <IconChevronDown />
                <span>Button SM</span>
                <IconChevronDown />
              </Button>
            </div>
          </div>
          {/* Primary Button With Left Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Primary Button With Left Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button spacing="default">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>

              <Button spacing="md">
                <IconChevronDown />
                <span>Button MD</span>
              </Button>

              <Button size="sm" spacing="sm">
                <IconChevronDown />
                <span>Button SM</span>
              </Button>
            </div>
          </div>
          {/* Primary Button With Right Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Primary Button With Right Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button spacing="default">
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button spacing="md">
                <span>Button MD</span>
                <IconChevronDown />
              </Button>

              <Button size="sm" spacing="sm">
                <span>Button SM</span>
                <IconChevronDown />
              </Button>
            </div>
          </div>
        </div>
        <div className="text-base-secondary">
          {/* Secondary Button Without Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Secondary Button Without Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary">
                <span>Button Text</span>
              </Button>

              <Button variant="secondary" size="sm" spacing="sm">
                <span>Button Text</span>
              </Button>

              <Button variant="secondary" size="lg" spacing="xl">
                <span>Button Text</span>
              </Button>
            </div>
          </div>
          {/* Secondary Button With Icons */}
          <div>
            <p className="mb-3 text-base font-medium">
              Secondary Button With Icons
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary">
                <IconChevronDown />
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="secondary" size="sm" spacing="sm">
                <IconChevronDown />
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="secondary" size="lg" spacing="xl">
                <IconChevronDown />
                <span>Button Text</span>
                <IconChevronDown />
              </Button>
            </div>
          </div>
          {/* Secondary Button With Left Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Secondary Button With Left Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>

              <Button variant="secondary" size="sm" spacing="sm">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>

              <Button variant="secondary" size="lg" spacing="xl">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>
            </div>
          </div>
          {/* Secondary Button With Right Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Secondary Button With Right Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary">
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="secondary" size="sm" spacing="sm">
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="secondary" size="lg" spacing="xl">
                <span>Button Text</span>
                <IconChevronDown />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="text-base-primary">
          {/* Primary Outline Button Without Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Primary Outline Button Without Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlinePrimary">
                <span>Button Text</span>
              </Button>

              <Button variant="outlinePrimary" size="sm" spacing="sm">
                <span>Button Text</span>
              </Button>

              <Button variant="outlinePrimary" size="lg" spacing="xl">
                <span>Button Text</span>
              </Button>
            </div>
          </div>
          {/* Primary Outline Button With Icons */}
          <div>
            <p className="mb-3 text-base font-medium">
              Primary Outline Button With Icons
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlinePrimary">
                <IconChevronDown />
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="outlinePrimary" size="sm" spacing="sm">
                <IconChevronDown />
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="outlinePrimary" size="lg" spacing="xl">
                <IconChevronDown />
                <span>Button Text</span>
                <IconChevronDown />
              </Button>
            </div>
          </div>
          {/* Primary Outline Button With Left Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Primary Outline Button With Left Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlinePrimary">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>

              <Button variant="outlinePrimary" size="sm" spacing="sm">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>

              <Button variant="outlinePrimary" size="lg" spacing="xl">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>
            </div>
          </div>
          {/* Primary Outline Button With Right Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Primary Outline Button With Right Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlinePrimary">
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="outlinePrimary" size="sm" spacing="sm">
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="outlinePrimary" size="lg" spacing="xl">
                <span>Button Text</span>
                <IconChevronDown />
              </Button>
            </div>
          </div>
        </div>
        <div className="text-base-secondary">
          {/* Secondary Outline Button Without Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Secondary Outline Button Without Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlineSecondary">
                <span>Button Text</span>
              </Button>

              <Button variant="outlineSecondary" size="sm" spacing="sm">
                <span>Button Text</span>
              </Button>

              <Button variant="outlineSecondary" size="lg" spacing="xl">
                <span>Button Text</span>
              </Button>
            </div>
          </div>
          {/* Secondary Outline Button With Icons */}
          <div>
            <p className="mb-3 text-base font-medium">
              Secondary Outline Button With Icons
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlineSecondary">
                <IconChevronDown />
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="outlineSecondary" size="sm" spacing="sm">
                <IconChevronDown />
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="outlineSecondary" size="lg" spacing="xl">
                <IconChevronDown />
                <span>Button Text</span>
                <IconChevronDown />
              </Button>
            </div>
          </div>
          {/* Secondary Outline Button With Left Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Secondary Outline Button With Left Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlineSecondary">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>

              <Button variant="outlineSecondary" size="sm" spacing="sm">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>

              <Button variant="outlineSecondary" size="lg" spacing="xl">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>
            </div>
          </div>
          {/* Secondary Outline Button With Right Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Secondary Outline Button With Right Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlineSecondary">
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="outlineSecondary" size="sm" spacing="sm">
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="outlineSecondary" size="lg" spacing="xl">
                <span>Button Text</span>
                <IconChevronDown />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="text-base-black">
          {/* Black Button Without Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Black Button Without Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="black">
                <span>Button Text</span>
              </Button>

              <Button variant="black" size="sm" spacing="sm">
                <span>Button Text</span>
              </Button>

              <Button variant="black" size="lg" spacing="xl">
                <span>Button Text</span>
              </Button>
            </div>
          </div>
          {/* Black Button With Icons */}
          <div>
            <p className="mb-3 text-base font-medium">
              Black Button With Icons
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="black">
                <IconChevronDown />
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="black" size="sm" spacing="sm">
                <IconChevronDown />
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="black" size="lg" spacing="xl">
                <IconChevronDown />
                <span>Button Text</span>
                <IconChevronDown />
              </Button>
            </div>
          </div>
          {/* Black Button With Left Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Black Button With Left Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="black">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>

              <Button variant="black" size="sm" spacing="sm">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>

              <Button variant="black" size="lg" spacing="xl">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>
            </div>
          </div>
          {/* Black Button With Right Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Black Button With Right Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="black">
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="black" size="sm" spacing="sm">
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="black" size="lg" spacing="xl">
                <span>Button Text</span>
                <IconChevronDown />
              </Button>
            </div>
          </div>
        </div>
        <div className="text-base-black">
          {/* Black Outline Button Without Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Black Outline Button Without Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlineBlack">
                <span>Button Text</span>
              </Button>

              <Button variant="outlineBlack" size="sm" spacing="sm">
                <span>Button Text</span>
              </Button>

              <Button variant="outlineBlack" size="lg" spacing="xl">
                <span>Button Text</span>
              </Button>
            </div>
          </div>
          {/* Black Outline Button With Icons */}
          <div>
            <p className="mb-3 text-base font-medium">
              Black Outline Button With Icons
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlineBlack">
                <IconChevronDown />
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="outlineBlack" size="sm" spacing="sm">
                <IconChevronDown />
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="outlineBlack" size="lg" spacing="xl">
                <IconChevronDown />
                <span>Button Text</span>
                <IconChevronDown />
              </Button>
            </div>
          </div>
          {/* Black Outline Button With Left Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Black Outline Button With Left Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlineBlack">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>

              <Button variant="outlineBlack" size="sm" spacing="sm">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>

              <Button variant="outlineBlack" size="lg" spacing="xl">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>
            </div>
          </div>
          {/* Black Outline Button With Right Icon */}
          <div>
            <p className="mb-3 text-base font-medium">
              Black Outline Button With Right Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlineBlack">
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="outlineBlack" size="sm" spacing="sm">
                <span>Button Text</span>
                <IconChevronDown />
              </Button>

              <Button variant="outlineBlack" size="lg" spacing="xl">
                <span>Button Text</span>
                <IconChevronDown />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex justify-between">
          {/* Outline Nav Button Only Icon */}
          <div className="text-base-primary">
            <p className="mb-3 text-base font-medium">
              Primary Button Only Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlineNavBtnPrimary" size="xl" spacing="lg">
                <IconChevronDown />
              </Button>
            </div>
          </div>

          {/* Secondary Button Only Icon */}
          <div className="text-base-secondary">
            <p className="mb-3 text-base font-medium">
              Secondary Button Only Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlineNavBtnSecondary" size="xl" spacing="lg">
                <IconChevronDown />
              </Button>
            </div>
          </div>
          {/* Black Button Only Icon */}
          <div className="text-base-black">
            <p className="mb-3 text-base font-medium">Black Button Only Icon</p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlineNavBtnBlack" size="xl" spacing="lg">
                <IconChevronDown />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          {/* Outline Nav Button Only Icon */}
          <div className="text-base-primary">
            <p className="mb-3 text-base font-medium">
              Primary Button Only Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlineNavBtnPrimary" size="xl" spacing="lg">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>
            </div>
          </div>

          {/* Secondary Button Only Icon */}
          <div className="text-base-secondary">
            <p className="mb-3 text-base font-medium">
              Secondary Button Only Icon
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlineNavBtnSecondary" size="xl" spacing="lg">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>
            </div>
          </div>
          {/* Black Button Only Icon */}
          <div className="text-base-black">
            <p className="mb-3 text-base font-medium">Black Button Only Icon</p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outlineNavBtnBlack" size="xl" spacing="lg">
                <IconChevronDown />
                <span>Button Text</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="">
          <p className="mb-3 text-base font-medium">Button Link</p>
          <div className="flex justify-between">
            <Button variant="linkPrimary" spacing="none">
              Button Text
            </Button>
            <Button variant="linkSecondary" spacing="none">
              Button Text
            </Button>
            <Button variant="linkDark" spacing="none">
              Button Text
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ButtonPage;
