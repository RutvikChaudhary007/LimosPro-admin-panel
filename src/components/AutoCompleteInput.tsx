import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AutoCompleteInputProps {
  value: string;
  setValue: (v: string) => void;
  list?: string[];
  onAdd: (s: string) => void;
  open?: boolean;
  setOpen?: (b: boolean) => void;
  typingTimer?: ReturnType<typeof setTimeout> | null;
  setTypingTimer?: (t: ReturnType<typeof setTimeout> | null) => void;
  placeholder?: string;
  inputId?: string;
}

export function AutoCompleteInput({
  value,
  setValue,
  list = [],
  onAdd,
  open,
  setOpen,
  typingTimer,
  setTypingTimer,
  placeholder = "Add item",
  inputId,
}: AutoCompleteInputProps) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalTypingTimer, setInternalTypingTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const effectiveOpen = open ?? internalOpen;
  const effectiveSetOpen = setOpen ?? setInternalOpen;
  const effectiveTypingTimer = typingTimer ?? internalTypingTimer;
  const effectiveSetTypingTimer = setTypingTimer ?? setInternalTypingTimer;

  itemRefs.current.length = 0;

  const filtered = list.filter((v: string) =>
    v.toLowerCase().includes(value.toLowerCase()),
  );

  return (
    <Popover open={effectiveOpen} onOpenChange={effectiveSetOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2">
          <InputGroup>
            <InputGroupInput
              id={inputId}
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => {
                const v = e.target.value;
                setValue(v);
                if (effectiveTypingTimer) clearTimeout(effectiveTypingTimer);
                const t = setTimeout(
                  () => effectiveSetOpen(v.trim().length > 0),
                  250,
                );
                effectiveSetTypingTimer(t);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (filtered.length > 0) {
                    const nextIndex =
                      activeIndex === null
                        ? 0
                        : Math.min(activeIndex + 1, filtered.length - 1);
                    itemRefs.current[nextIndex]?.focus();
                    setActiveIndex(nextIndex);
                  }
                }

                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  if (activeIndex !== null) {
                    const prevIndex = activeIndex - 1;
                    if (prevIndex < 0) {
                      document.getElementById(inputId ?? "")?.focus();
                      setActiveIndex(null);
                    } else {
                      itemRefs.current[prevIndex]?.focus();
                      setActiveIndex(prevIndex);
                    }
                  }
                }

                if (e.key === "Enter") {
                  e.preventDefault();
                  if (value.trim().length > 0) {
                    onAdd(value.trim());
                    setValue("");
                    effectiveSetOpen(false);
                    setActiveIndex(null);
                  }
                }
              }}
            />
          </InputGroup>
          <Button
            type="button"
            onClick={() => {
              if (value.trim().length > 0) {
                onAdd(value.trim());
                setValue("");
                effectiveSetOpen(false);
                setActiveIndex(null);
              }
            }}
            size="xl"
            spacing="lg"
            tooltip="Add item"
          >
            <Plus />
          </Button>
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={4}
        className="w-full p-0 min-w-[var(--radix-popover-trigger-width)] z-10 rounded"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandList>
            <CommandEmpty className="pt-2 pb-1 text-center">
              No results found.
            </CommandEmpty>
            <CommandGroup>
              {filtered.map((item, index) => (
                <CommandItem
                  key={item}
                  tabIndex={0}
                  ref={(el: HTMLDivElement | null) => {
                    itemRefs.current[index] = el;
                  }}
                  className={cn(
                    "rounded capitalize",
                    activeIndex === index ? "bg-gray-200 text-black" : "",
                  )}
                  onFocus={() => setActiveIndex(index)}
                  onSelect={() => {
                    onAdd(item);
                    setValue("");
                    effectiveSetOpen(false);
                    setActiveIndex(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      const next = itemRefs.current[index + 1];
                      if (next) {
                        next.focus();
                        setActiveIndex(index + 1);
                      }
                    }

                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      if (index === 0) {
                        document.getElementById(inputId ?? "")?.focus();
                        setActiveIndex(null);
                      } else {
                        const prev = itemRefs.current[index - 1];
                        if (prev) {
                          prev.focus();
                          setActiveIndex(index - 1);
                        }
                      }
                    }

                    if (e.key === "Enter") {
                      e.preventDefault();
                      onAdd(item);
                      setValue("");
                      effectiveSetOpen(false);
                      setActiveIndex(null);
                    }
                  }}
                >
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
