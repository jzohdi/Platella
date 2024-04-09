export async function uploadFileToAws(
  url: string,
  file: File,
): Promise<string | void> {
  return await fetch(url, {
    body: file,
    method: "PUT",
  })
    .then((res) => res.text())
    .catch((e) => {
      console.error("failed to upload file: ", e);
    });
}
