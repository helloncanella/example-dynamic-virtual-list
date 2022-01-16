import _ from "lodash";
import React from "react";
import { VariableSizeList } from "react-window";
import useComponentSize from "@rehooks/component-size";

function VirtualizedList(props, externalRef) {
  const ref = React.useRef(null);
  const rowsHeightRef = React.useRef([]);

  React.useImperativeHandle(externalRef, () => ref.current, []);

  const providerValue = React.useMemo(
    {
      Child: props.children,
      onChangeHeight(height, index) {
        if (height !== rowsHeightRef.current?.[index]) {
          rowsHeightRef.current[index] = height;
          ref.current?.resetAfterIndex(index);
        }
      },
    },
    [props.children]
  );

  return (
    <VirtualizedListContext.Provider value={providerValue}>
      <VariableSizeList
        {...props}
        itemSize={(index) => rowsHeightRef.current?.[index] || 0}
        ref={ref}
      >
        {Render}
      </VariableSizeList>
    </VirtualizedListContext.Provider>
  );
}

function Render({ index, style }) {
  const context = React.useContext(VirtualizedListContext);

  if (!context?.Child) return null;

  const divRef = React.useRef(null);
  const size = useComponentSize(divRef);

  React.useEffect(() => {
    if (typeof context.onChangeHeight !== "function") return;
    if (typeof size.height !== "number") return;

    context.onChangeHeight(size.height, index);
  }, [size.height]);

  return (
    <div style={style}>
      <div ref={divRef}>{React.createElement(context.Child, ...arguments)}</div>
    </div>
  );
}

const VirtualizedListContext = React.createContext({
  onChangeHeight(height, index) {
    return 0;
  },
  Child: function Child() {
    return <></>;
  },
});

export default React.forwardRef(VirtualizedList);
