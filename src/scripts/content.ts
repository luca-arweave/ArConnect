import {
  sendMessage,
  validateMessage,
  MessageFormat
} from "../utils/messenger";

function addScriptToWindow(path: string) {
  try {
    const container = document.head || document.documentElement,
      script = document.createElement("script");

    script.setAttribute("async", "false");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", path);
    container.insertBefore(script, container.children[0]);
    container.removeChild(script);
  } catch (e) {
    console.error("Failed to inject ArConnect api", e);
  }
}

// add the inter font to the head of the page
const interFont = document.createElement("link");
interFont.rel = "stylesheet";
interFont.href =
  "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap";
document.head.appendChild(interFont);

// inject the api
addScriptToWindow(chrome.extension.getURL("build/scripts/injected.js"));

// forward messages from the api to the background script
window.addEventListener("message", (e) => {
  if (!validateMessage(e.data, {}) || !e.data.type) return;
  sendMessage(e.data, (res) => sendMessage(res, undefined, undefined, false));
});

// wallet switch event
chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  const message: MessageFormat = msg;
  if (
    !validateMessage(message, {
      sender: "popup",
      type: "switch_wallet_event_forward"
    })
  )
    return;

  return sendMessage(message, undefined, undefined, false);
});

export {};
