import { axiosInstance } from "../hooks/axiosInstance"

export const uploadFilesToS3 = async (files: File[]) => {
  const uploadedUrls: string[] = []

  for (const file of files) {
    try {
      const { data } = await axiosInstance.post("/media/generate-signed-url", { fileName: file.name, fileType: file.type })
      const { uploadUrl, fileUrl } = data;

      await axiosInstance.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type
        }
      })

      uploadedUrls.push(fileUrl)
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error
    }
  }

  return uploadedUrls;
}
