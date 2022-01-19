import React, { useEffect, useMemo, useState } from "react";
import VirtualizedList from "./components/VirtualizedList/VirtualizedList";

import { loremIpsum } from "lorem-ipsum";

function App() {
  const ref = React.useRef(null);

  useEffect(() => {
    console.log(ref);
  }, []);

  return (
    <div className="app" style={{ height: "100%" }}>
      <VirtualizedList
        itemCount={1523745}
        overscanCount={50}
        estimatedItemSize={70}
        height={window.outerHeight / 2}
        width={window.innerWidth / 3}
        ref={ref}
      >
        {Oi}
      </VirtualizedList>
      {/* {null} */}
    </div>
  );
}

export default App;

function Oi(props: { index: number }) {
  const o = useMemo(() => loremIpsum(), []);
  return (
    <div style={{ padding: 8, borderTop: "2px solid red" }} className="oi">
      <>
        <b>{props.index} - </b> <span>{o}</span>
      </>
    </div>
  );

  // return null;
}
