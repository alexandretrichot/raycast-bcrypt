import { useEffect, useState } from "react";
import { List, ActionPanel, Action, Clipboard, Icon } from "@raycast/api";
import * as bcrypt from "bcrypt-ts";

export default function Command() {
  const [clipboardText, setClipboardText] = useState<string | undefined>(undefined);
  const [input, setInput] = useState(clipboardText);
  const [hashed, setHashed] = useState<string | undefined>(undefined);

  useEffect(() => {
    Clipboard.readText().then((clipboardContents) => {
      setClipboardText(clipboardContents);
    });
  }, []);

  useEffect(() => {
    const _input = input || clipboardText;
    if (_input) {
      bcrypt.hash(_input, 10).then((h) => setHashed(h));
    } else {
      setHashed(undefined);
    }
  }, [input, clipboardText]);

  return (
    <List
      onSearchTextChange={(newValue) => {
        setInput(newValue || clipboardText);
      }}
      searchBarPlaceholder={"Text to hash..."}
    >
      {hashed ? (
        <>
          <List.Section title={`Input: ${input || clipboardText}`}>
            <List.Item
              key={"hash"}
              icon={Icon.CodeBlock}
              title={"Hash"}
              subtitle={hashed}
              actions={
                hashed ? (
                  <ActionPanel>
                    <Action.CopyToClipboard content={hashed} />
                  </ActionPanel>
                ) : undefined
              }
            />
          </List.Section>
        </>
      ) : (
        <List.EmptyView
          icon={Icon.QuestionMarkCircle}
          title={"Nothing to Hash"}
          description={"Copy some content to your clipboard, or start typing text to hash."}
        />
      )}
    </List>
  );
}
