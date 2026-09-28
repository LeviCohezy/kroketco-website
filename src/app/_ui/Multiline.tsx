import { Fragment } from "react";

// Renders editable text where the admin's line breaks become <br />. Use for
// any "textarea" content field (and headings that used to contain <br />).
export default function Multiline({ text }: { text: string }) {
  const lines = text.split(/\r?\n/);
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}
