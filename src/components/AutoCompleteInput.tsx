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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
  open: boolean;
  setOpen: (b: boolean) => void;
  typingTimer: ReturnType<typeof setTimeout> | null;
  setTypingTimer: (t: ReturnType<typeof setTimeout> | null) => void;
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

  itemRefs.current.length = 0;

  const filtered = list.filter((v: string) =>
    v.toLowerCase().includes(value.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <InputGroup>
          <InputGroupInput
            id={inputId}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              const v = e.target.value;
              setValue(v);
              if (typingTimer) clearTimeout(typingTimer);
              const t = setTimeout(() => setOpen(v.trim().length > 0), 250);
              setTypingTimer(t);
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
                  setOpen(false);
                  setActiveIndex(null);
                }
              }
            }}
          />

          <InputGroupAddon align={"inline-end"}>
            <Button
              type="button"
              onClick={() => {
                if (value.trim().length > 0) {
                  onAdd(value.trim());
                  setValue("");
                  setOpen(false);
                  setActiveIndex(null);
                }
              }}
              size="xl"
              spacing="lg"
            >
              <Plus />
            </Button>
          </InputGroupAddon>
        </InputGroup>
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
                    "rounded",
                    activeIndex === index ? "bg-gray-200 text-black" : "",
                  )}
                  onFocus={() => setActiveIndex(index)}
                  onSelect={() => {
                    onAdd(item);
                    setValue("");
                    setOpen(false);
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
                      setOpen(false);
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
