import _ from "lodash";
import React from "react";
import { VariableSizeList } from "react-window";
import useComponentSize from "@rehooks/component-size";

function VirtualizedList(props, externalRef) {
  const ref = React.useRef(null);
  const rowsHeightRef = React.useRef([]);

  React.useImperativeHandle(externalRef, () => ref.current, []);

  const providerValue = React.useMemo(() => {
    return {
      Child: props.children,
      onChangeHeight(height, index) {
        if (height !== rowsHeightRef.current?.[index]) {
          rowsHeightRef.current[index] = height;
          height && ref.current?.resetAfterIndex(index);
        }
      },
    };
  }, [props.children]);

  const itemSize = React.useCallback((index) => {
    const height = rowsHeightRef.current?.[index] || 0;
    return height || 20;
  }, []);

  return (
    <VirtualizedListContext.Provider value={providerValue}>
      <VariableSizeList {...props} itemSize={itemSize} ref={ref}>
        {DynamicRow}
      </VariableSizeList>
    </VirtualizedListContext.Provider>
  );
}

function DynamicRow({ index, style }) {
  const context = React.useContext(VirtualizedListContext);

  const divRef = React.useRef(null);
  const size = useComponentSize(divRef);

  React.useEffect(() => {
    if (typeof context.onChangeHeight !== "function") return;
    if (typeof size.height !== "number") return;

    context.onChangeHeight(size.height, index);
  }, [size.height]);

  if (!context?.Child) return null;

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

function Ok() {
  return 80;
}
