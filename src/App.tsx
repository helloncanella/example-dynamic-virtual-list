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
        itemCount={300000}
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
  const [content, setContent] = React.useState(loremIpsum());

  useEffect(() => {
    if (props.index % 100 == 0) {
      setTimeout(() => {
        setContent(loremIpsum());
      }, Math.ceil(Math.random() * 3) * 1000);
    }
  }, []);

  return (
    <div style={{ padding: 8, borderTop: "2px solid red" }} className="oi">
      <>
        <b>{props.index} - </b> <span>{content}</span>
      </>
    </div>
  );

  // return null;
}
