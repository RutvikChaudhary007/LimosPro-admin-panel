import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import { CheckIcon, CreditCardIcon, Search } from "lucide-react"

function TextFieldPage() {
  return (
    <div className="flex gap-2 p-2">
      <div className="w-1/2 space-y-3">
        <div className="">
          <Input placeholder="Placeholder Text" />
        </div>
        <div className="">
          <InputGroup>
            <InputGroupInput placeholder="Card number" />
            <InputGroupAddon>
              <CreditCardIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="">
          <InputGroup>
            <InputGroupInput placeholder="Card number" />
            <InputGroupAddon align="inline-end">
              <CreditCardIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <CheckIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="">
          <InputGroup>
            <InputGroupInput placeholder="Card number" />
            <InputGroupAddon align="inline-end">
              <CreditCardIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="">
          <InputGroup>
            <InputGroupInput placeholder="Card number" />
          </InputGroup>
        </div>
        <div className="">
          <Textarea placeholder="Text Area" />
        </div>
      </div>
      <div className="w-1/2 space-y-3">
        {/* 1️⃣ Simple Input */}
        <div>
          <Input variant="secondary" placeholder="Placeholder Text" />
        </div>

        {/* 2️⃣ InputGroup with icons — primary */}
        <div>
          <InputGroup variant="secondary">
            <InputGroupInput placeholder="Card number" />
            <InputGroupAddon variant="secondary">
              <CreditCardIcon />
            </InputGroupAddon>
            <InputGroupAddon variant="secondary" align="inline-end">
              <CheckIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* 3️⃣ InputGroup with multiple icons — secondary */}
        <div>
          <InputGroup variant="secondary">
            <InputGroupInput placeholder="Card number" />
            <InputGroupAddon variant="secondary" align="inline-end">
              <CreditCardIcon />
            </InputGroupAddon>
            <InputGroupAddon variant="secondary" align="inline-end">
              <CheckIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* 4️⃣ Single end icon — secondary */}
        <div>
          <InputGroup variant="secondary">
            <InputGroupInput placeholder="Card number" />
            <InputGroupAddon variant="secondary" align="inline-end">
              <CreditCardIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* 5️⃣ InputGroup without addon — secondary */}
        <div>
          <InputGroup variant="secondary">
            <InputGroupInput placeholder="Card number" />
          </InputGroup>
        </div>

        {/* 6️⃣ Textarea group — secondary */}
        <div>
          <Textarea variant="secondary" placeholder="Text Area" />
        </div>
      </div>
    </div>
  )
}

export default TextFieldPage
