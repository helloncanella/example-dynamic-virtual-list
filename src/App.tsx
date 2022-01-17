import React, { useEffect, useMemo, useState } from "react";
import VirtualizedList from "./components/VirtualizedList/VirtualizedList";

import { loremIpsum } from "lorem-ipsum";

function App() {
  const [state, setState] = useState(0);

  return (
    <div className="app" style={{ height: "100%" }}>
      <VirtualizedList
        itemCount={156469998799}
        overscanCount={10}
        estimatedItemSize={70}
        height={window.innerHeight}
        width={window.innerWidth / 3}
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
    <div style={{ padding: 8, borderTop: "2px solid red" }}>
      <>
        <b>{props.index} - </b> <span>{o}</span>
      </>
    </div>
  );

  // return null;
}
