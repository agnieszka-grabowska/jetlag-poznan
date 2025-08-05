import { CSSProperties } from "react";

export default function Box({
  children,
  maxWidth,
  marginInline,
  marginBlock,
  paddingInline,
  paddingBlock,
  overflow,
}: {
  children: React.ReactNode;
  maxWidth?: CSSProperties["maxWidth"];
  marginInline?: CSSProperties["marginInline"];
  marginBlock?: CSSProperties["marginBlock"];
  paddingInline?: CSSProperties["paddingInline"];
  paddingBlock?: CSSProperties["paddingBlock"];
  overflow?: CSSProperties["overflow"];
}) {
  return (
    <div
      style={{
        maxWidth,
        marginInline,
        marginBlock,
        paddingInline,
        paddingBlock,
        overflow,
      }}
    >
      {children}
    </div>
  );
}
