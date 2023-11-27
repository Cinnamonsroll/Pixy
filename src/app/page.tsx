"use client";
import { For } from "@/components/functional/for.component";
import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import SyntaxEditable from "@/components/functional/SyntaxEditable";

export default function Home() {
  const query = useSearchParams();
  const [count, set_count] = useState(16);
  const [code, set_code] = useState("");
  const [values, set_values] = useState<Float32Array | null>(null);
  const animationRef = useRef<number>(0);
  const [tab, set_tab] = useState(0);
  const callback = useMemo(() => {
    try {
      const func = new Function(
        "t",
        "i",
        "x",
        "y",
        `
        try {
          with(Math){
          return (${(code || "sin(i ** 2)").replace(/\\/g, ";")});
          }
        } catch (err) {
          return err;
        }
      `
      );
      return func;
    } catch (err) {
      console.error("Error creating function:", err);
      return () => err;
    }
  }, [code]);

  const animate = (time: number) => {
    const newTime = time / 1000;
    const newValues = new Float32Array(count * count * 4);

    for (let i = 0; i < count * count; i++) {
      const x = i % count;
      const y = Math.floor(i / count);
      const value = callback(newTime, i, x, y);
      const size = count * 2;
      let radius = (Math.abs(value) * size) / 2;
      if (radius > size / 2) radius = size / 2;

      newValues[i * 4] = x;
      newValues[i * 4 + 1] = y;
      newValues[i * 4 + 2] = radius;
      newValues[i * 4 + 3] = value > 0 ? 1 : 0;
    }

    set_values(newValues);

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  useEffect(() => {
    const routerCode = query.get("code");
    if (routerCode) set_code(decodeURIComponent(routerCode as string));
  }, []);

  const handleShareClick = () => {
    navigator.clipboard.writeText(
      `${window.location.protocol}//${
        window.location.host
      }?code=${encodeURIComponent(code)}`
    );
  };
  const handleCodeChange = (newCode: string) => {
    set_code(newCode);
  };

  return (
    <div className="flex flex-col h-screen text-gray-100 bg-background-950">
      <div className="w-full bg-background-800 bg-opacity-40 h-16 p-2 border-b border-b-background-950 flex items-center gap-1">
        <button
          onClick={handleShareClick}
          className="w-20 bg-[#4e51dd] text-white rounded-md p-2 text-xs font-bold flex justify-center"
        >
          Share
        </button>
        <button
          className="w-20 bg-[#4e51dd] text-white rounded-md p-2 text-xs font-bold flex md:hidden justify-center"
          onClick={() => set_tab(tab^1)}
        >
          {!tab ? "Preview" : "Editor"}
        </button>
      </div>
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
        {/* Code editor */}
        <div className={`w-full h-full ${!tab ? "flex" : "hidden"} justify-center items-center`}>
        <SyntaxEditable code={code} onChange={handleCodeChange} />
        </div>
        {/* Output */}
        <div className={`h-full w-full ${!tab ? "hidden" : "flex"} md:flex items-center justify-center`}>
          <div className={`grid grid-cols-16`}>
            <For
              count={count * count}
              render={(index: number) => {
                if (!values) return null;
                const baseIndex = index * 4;
                const radius = values[baseIndex + 2];
                const color =
                  values[baseIndex + 3] > 0 ? "bg-white" : "bg-red-600";

                return (
                  <div
                    key={index}
                    style={{
                      width: radius,
                      height: radius,
                    }}
                    className={`${color} rounded-full`}
                  ></div>
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
