import { HStack } from "@chakra-ui/react"
import { Accordion } from "@ark-ui/react"
import * as React from "react"
import { LuChevronDown } from "react-icons/lu"

interface AccordionItemTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  indicatorPlacement?: "start" | "end"
}

export const AccordionItemTrigger = React.forwardRef<HTMLButtonElement, AccordionItemTriggerProps>(
  function AccordionItemTrigger(props, ref) {
    const { children, indicatorPlacement = "end", ...rest } = props
    return (
      <Accordion.ItemTrigger {...rest} ref={ref}>
        {indicatorPlacement === "start" && (
          <span style={{ transform: "rotate(-90deg)" }}>
            <LuChevronDown />
          </span>
        )}
        <HStack gap="4" flex="1" textAlign="start" width="full">
          {children}
        </HStack>
        {indicatorPlacement === "end" && (
          <span>
            <LuChevronDown />
          </span>
        )}
      </Accordion.ItemTrigger>
    )
  }
)

export const AccordionItemContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function AccordionItemContent(props, ref) {
    return (
      <Accordion.ItemContent>
        <div {...props} ref={ref} />
      </Accordion.ItemContent>
    )
  }
)

export const AccordionRoot = Accordion.Root
export const AccordionItem = Accordion.Item
