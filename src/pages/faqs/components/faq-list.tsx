"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useSticky } from "@/hooks/useSticky";
import { cn } from "@/lib/utils";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Category {
  name: string;
  count?: number;
}

interface FAQListProps {
  faqs: FAQ[];
  categories: Category[];
}

export function FAQList({ faqs, categories }: FAQListProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQs based on selected category and search query
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      (faq.question ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.answer ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sticky hook
  const { stickyRef, sentinelRef } = useSticky(100, 1024);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-4 gap-6">
      {/* Categories Sidebar */}
      <div className="lg:col-span-2 xl:col-span-1">
        <div ref={sentinelRef} className="h-px"></div>
        <Card ref={stickyRef} className="h-fit">
          <CardBody>
            <CardHeader className="space-y-2">
              <CardTitle>Categories</CardTitle>
              <InputGroup>
                <InputGroupInput
                  placeholder="Search FAQs..."
                  className="cursor-pointer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
              </InputGroup>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded hover:bg-base-light-gray cursor-pointer transition-colors group capitalize",
                    selectedCategory === category.name && "bg-base-light-gray",
                  )}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <span className="font-medium">{category.name}</span>
                  <Badge
                    className="transition-colors"
                    variant={
                      selectedCategory === category.name ? "default" : "outline"
                    }
                  >
                    {category.name === "All"
                      ? faqs.length
                      : (category.count ?? 0)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </CardBody>
        </Card>
      </div>

      {/* FAQs List */}
      <div className="lg:col-span-4 xl:col-span-3">
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle className="capitalize">
                {selectedCategory === "All"
                  ? "All FAQs"
                  : `${selectedCategory} FAQs`}
                <span className="text-sm font-normal text-base-gray ml-2">
                  ({filteredFaqs.length}{" "}
                  {filteredFaqs.length === 1 ? "question" : "questions"})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8 text-base-gray">
                  <p>No FAQs found matching your search criteria.</p>
                </div>
              ) : (
                <Accordion
                  type="single"
                  collapsible
                  className="space-y-4"
                  defaultValue="item-1"
                >
                  {filteredFaqs.map((item) => (
                    <AccordionItem key={item.id} value={`item-${item.id}`}>
                      <AccordionTrigger>
                        <div className="flex items-start text-left">
                          <span>{item.question ?? ""}</span>
                          <Badge
                            variant="outline"
                            className="ms-3 mt-0.5 shrink-0"
                          >
                            {item.category ?? ""}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>{item.answer ?? ""}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
