// utils.ts

export async function uploadToArweave(
  message: string,
  file: any,
  setMessageFunc: Function
) {
  if (!file || !message) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("message", message);

  try {
    const response = await fetch("/api/uploadBoth", {
      method: "POST",
      body: formData,
    });
    const json = await response.json();
    console.log("json:", json);

    // You may want to handle setting the txId differently,
    // this is just a placeholder for the sake of example
    setMessageFunc(json.txId);
  } catch (err) {
    console.log({ err });
  }
}
