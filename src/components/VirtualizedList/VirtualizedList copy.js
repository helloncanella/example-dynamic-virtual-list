
import _ from "lodash"
import React, { Ref } from "react"
import { makeStyles } from "@material-ui/core"
import AutoSizer from "react-virtualized-auto-sizer"
import { VariableSizeList, VariableSizeListProps } from "react-window"
import clsx from "clsx"
import useComponentSize from "@rehooks/component-size"
import useMemoAPI from "hooks/useMemoAPI"
import useOnChange from "hooks/useOnChange"

export default function VirtualizedList(props) {
  const c = useStyles()

  const variableSizeListRef = React.useRef(null)
  const itemsRefs = React.useRef([])

  const providerValue = useMemoAPI({
    itemsRefs,
    variableSizeListRef,
    rootProps: props,
  })

  if (typeof props.itemCount !== "number") return null

  return (
    <VirtualizedListContext.Provider value={providerValue}>
      <AutoSizer className={clsx(c.root, "virtualized-list")}>
        {({ height, width }) => {
          return (
            <VariableSizeList
              {...props}
              itemSize={(index) => itemsRefs.current[index]?.height || 0}
              height={height}
              width={width}
              ref={variableSizeListRef}
            >
              {Render}
            </VariableSizeList>
          )
        }}
      </AutoSizer>
    </VirtualizedListContext.Provider>
  )
  // return null
}

const Render: VariableSizeListProps["children"] = function Render(...args) {
  const { index, style } = args[0]

  const { itemsRefs, variableSizeListRef, rootProps } = React.useContext(
    VirtualizedListContext
  )

  const children = rootProps?.children

  if (!children) return null

  return (
    <Item
      style={style}
      ref={(e) => {
        if (!itemsRefs) return
        itemsRefs.current && (itemsRefs.current[index] = e)
      }}
      onChangeHeight={(value) => {
        variableSizeListRef?.current?.resetAfterIndex(index)
      }}
    >
      {React.createElement(children, ...args)}
    </Item>
  )
}
const useStyles = makeStyles((theme) => {
  return {
    root: {
      height: "100%",
    },
  }
})

type ItemAPI = { height: number }

const Item = React.forwardRef(function Item(
  props: {
    children: React.ReactChild
    onChangeHeight: (value: number) => any
    style: React.CSSProperties
  },
  ref: React.Ref<ItemAPI>
) {
  const divRef = React.useRef<HTMLDivElement>(null)
  const size = useComponentSize(divRef)

  React.useImperativeHandle(
    ref,
    () => {
      return { height: size.height }
    },
    [size.height]
  )

  useOnChange<number>({
    value: size.height,
    onChange: props.onChangeHeight,
  })

  return (
    <div style={props.style}>
      <div ref={divRef}>{props.children}</div>
    </div>
  )
})

interface IVirtualizedListContext {
  itemsRefs: React.RefObject<(ItemAPI | null)[] | undefined> | null
  variableSizeListRef: React.RefObject<VariableSizeList | undefined> | null
  rootProps: VirtualizedListProps | null
}

const VirtualizedListContext = React.createContext<IVirtualizedListContext>({
  itemsRefs: null,
  variableSizeListRef: null,
  rootProps: null,
})
