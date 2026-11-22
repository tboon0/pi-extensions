import assert from "node:assert/strict";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// node tests/btw.mjs /path/to/@earendil-works/pi-coding-agent
const pkg = resolve(process.argv[2]);
const { loadExtensions } = await import(pathToFileURL(`${pkg}/dist/core/extensions/loader.js`));
const loaded = await loadExtensions([resolve("extensions/btw.ts")], process.cwd());
assert.deepEqual(loaded.errors, []);
const ext = loaded.extensions[0];
const command = ext.commands.get("btw");
assert.ok(command);
const entries = [], notices = [], widgets = [], requests = [];
let escListener, idle = true, editorText = "";
loaded.runtime.appendEntry = (type, data) => entries.push({ type, data });
let finish;
const ctx = {
  hasUI: true, mode: "tui", model: { id: "test", contextWindow: 128000 },
  sessionManager: { buildSessionProjection: () => ({ messages: [
    { role: "system", content: "Old tool instructions", toolsAdded: [{ name: "bash" }] },
    { role: "user", content: "We are fixing login", timestamp: 1 },
    { role: "toolResult", toolName: "read", content: [{ type: "text", text: "file evidence" }] },
  ] }) },
  isIdle: () => idle,
  ui: {
    notify: (...args) => notices.push(args),
    setWidget: (...args) => widgets.push(args),
    getEditorText: () => editorText,
    onTerminalInput: (handler) => {
      escListener = handler;
      return () => { if (escListener === handler) escListener = undefined; };
    },
  },
  modelRegistry: { streamSimple: (model, context, options) => {
    requests.push({ model, context, options });
    return { result: () => new Promise((resolve) => { finish = resolve; }) };
  } },
};
const flush = () => new Promise((resolve) => setImmediate(resolve));
const response = { stopReason: "stop", content: [{ type: "text", text: "Side answer" }] };
await command.handler("", ctx);
assert.equal(requests.length, 0);
await command.handler("--cancel", ctx);
assert.match(notices.at(-1)[0], /No side question/);
await command.handler("Why?", ctx);
assert.equal(requests.length, 1);
// Spinner widget appears above the editor and stops when disposed.
assert.equal(widgets.at(-1)[0], "btw");
const theme = { fg: (_color, text) => text };
const loader = widgets.at(-1)[1]({ requestRender() {} }, theme);
assert.match(loader.render(120).join(""), /Why\?.*one at a time.*--cancel/);
loader.dispose();
assert.equal(entries.length, 0);
assert.match(requests[0].context.messages[1].content, /fixing login/);
assert.match(requests[0].context.messages[1].content, /file evidence/);
assert.doesNotMatch(JSON.stringify(requests[0].context), /toolsAdded|Old tool instructions/);
assert.notEqual(requests[0].options.sessionId, undefined);
await command.handler("Duplicate", ctx);
assert.equal(requests.length, 1);
assert.match(notices.at(-1)[0], /one side question at a time/);
finish(response);
await flush();
assert.deepEqual(entries, [{ type: "btw", data: { question: "Why?", answer: "Side answer" } }]);
// The answer stays pinned above the editor until Esc while idle with an empty editor.
assert.match(widgets.at(-1)[1](undefined, theme).render(80).join("\n"), /Why\?[\s\S]*Side answer[\s\S]*Esc to dismiss/);
idle = false;
assert.equal(escListener("\x1b"), undefined);
idle = true;
editorText = "draft";
assert.equal(escListener("\x1b"), undefined);
editorText = "";
assert.equal(escListener("x"), undefined);
assert.equal(typeof widgets.at(-1)[1], "function");
assert.deepEqual(escListener("\x1b"), { consume: true });
assert.deepEqual(widgets.at(-1), ["btw", undefined]);
assert.equal(escListener, undefined);
// Long answers are capped; a new /btw replaces the pinned answer.
await command.handler("Long", ctx);
finish({ stopReason: "stop", content: [{ type: "text", text: Array.from({ length: 30 }, (_, i) => `line ${i}`).join("\n\n") }] });
await flush();
const pinnedLong = widgets.at(-1)[1](undefined, theme).render(80).join("\n");
assert.match(pinnedLong, /more lines in the transcript/);
assert.doesNotMatch(pinnedLong, /line 29/);
entries.pop();
await command.handler("Cancel me", ctx);
await command.handler("--cancel", ctx);
assert.equal(requests.at(-1).options.signal.aborted, true);
assert.deepEqual(widgets.at(-1), ["btw", undefined]);
assert.match(notices.at(-1)[0], /cancelled/);
finish(response);
await flush();
assert.equal(entries.length, 1);
await command.handler("RPC", { ...ctx, mode: "rpc" });
assert.match(widgets.at(-1)[1][0], /RPC.*--cancel/);
await command.handler("--cancel", ctx);
finish(response);
await flush();
await command.handler("Shutdown", ctx);
await ext.handlers.get("session_shutdown")[0]({}, ctx);
assert.equal(requests.at(-1).options.signal.aborted, true);
finish(response);
await flush();
assert.equal(entries.length, 1);
await command.handler("Failure", ctx);
finish({ stopReason: "error", errorMessage: "provider failed", content: [] });
await flush();
assert.match(notices.at(-1)[0], /provider failed/);
await command.handler("No model", { ...ctx, model: undefined });
assert.match(notices.at(-1)[0], /Select a model/);
await assert.rejects(command.handler("No UI", { ...ctx, hasUI: false }), /requires/);
console.log("Pi btw: native loading, context isolation, non-blocking requests, loading widget, pinned answer, cancellation, shutdown and errors passed.");
