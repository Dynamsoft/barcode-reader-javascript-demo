// ignore this part when uploading to github(the whole file)
function generateUuid() {
  if (typeof window !== "undefined" && window.crypto && typeof window.crypto.getRandomValues === "function") {
    let u8 = new Uint8Array(36);
    window.crypto.getRandomValues(u8);
    let str = "";
    for (let i = 0; i < 36; ++i) {
      let c = u8[i] % 36;
      if (c < 10) {
        str += c;
      } else {
        str += String.fromCharCode(c + 87);
      }
    }
    return str;
  } else {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
if (!window.sessionId) {
  let uuid = generateUuid();
  let timeId = new Date().toISOString();
  window.sessionId = timeId + "/" + uuid;
}
