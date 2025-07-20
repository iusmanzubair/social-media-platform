import { Image, Smile, X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Button } from "./ui/Button";
import debounce from "lodash.debounce"
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../hooks/axiosInstance";
import { AxiosError } from "axios";
import { uploadFilesToS3 } from "../lib/uploadFilesToS3";
import { cn } from "../lib/utils";

const MAX_FILES = 2;

interface PostProps {
  initialRowCount: number,
  buttonText: string,
  placeholder: string,
  query: string,
  postId?: string,
  parentReplyId?: string,
  conversationId?: string
}

export const Post = ({ initialRowCount, buttonText, placeholder, query, postId, parentReplyId, conversationId }: PostProps) => {
  const [rowCount, setRowCount] = useState<number>(initialRowCount);
  const [textContent, setTextContent] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();

  const debouncehandleChange = debounce((e: ChangeEvent<HTMLTextAreaElement>) => {
    const textAreaLineHeight = 24;
    const minRows = initialRowCount;

    const previousRows = e.target.rows
    e.target.rows = minRows
    const currentRows = Math.floor((e.target.scrollHeight - textAreaLineHeight) / textAreaLineHeight)

    if (currentRows === previousRows) {
      e.target.rows = currentRows;
    }

    setRowCount(currentRows)
  }, 130)

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextContent(e.target.value)
    debouncehandleChange(e)
  }

  const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0)
      return;

    const files = Array.from(e.target.files);
    if (selectedFiles.length + files.length > MAX_FILES) {
      toast.error(`You can only upload a maximum of ${MAX_FILES} files`)
      return;
    }

    setSelectedFiles([...selectedFiles, ...files])
  }

  const removeSelectedFile = (file: File) => {
    const removedFile = selectedFiles?.filter(_file => _file !== file)

    setSelectedFiles(removedFile)
  }

  const { mutate: onSumbit, isPending } = useMutation({
    mutationFn: async () => {
      const uploadedUrls = await uploadFilesToS3(selectedFiles);

      await axiosInstance.post(query, {
        content: textContent,
        uploadedUrls,
        mediaType: "image",
        postId,
        parentReplyId,
        conversationId
      })
    },
    onSuccess: () => {
      setSelectedFiles([])
      setTextContent("")
      setRowCount(initialRowCount)
      queryClient.refetchQueries({ queryKey: ['feed'] })

      if (conversationId)
        queryClient.refetchQueries({ queryKey: ["fetchMessages"] })
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message || "Something went wrong")
      }

      toast.error("Something went wrong")
    }
  })

  return (
    <div className="border border-t-0 border-gray-300 relative flex flex-col items-end">
      <textarea
        className="w-full bg-transparent outline-none text-base px-4 py-3 resize-none leading-6"
        placeholder={placeholder}
        value={textContent}
        onChange={handleChange}
        rows={rowCount}
        maxLength={300}
        autoFocus
      />
      <div className={cn("grid grid-cols-1 m-4 gap-2", { "grid-cols-2": selectedFiles.length >= 2 })}>
        {
          selectedFiles && selectedFiles.map((file, key) => (
            <div key={key} className="relative">
              <img src={URL.createObjectURL(file)} className="rounded-2xl" />

              <button className="absolute bg-black text-white rounded-full p-2 top-3 right-3" onClick={() => removeSelectedFile(file)}><X className="w-5 h-5" /></button>
            </div>
          ))
        }
      </div>

      <div className="flex items-center justify-between w-[80%] pr-4">
        <div className="flex gap-4">
          <input type="file" id="image" accept="image/*" className="hidden" onChange={uploadFile} value="" multiple />
          <label htmlFor="image" className="cursor-pointer">
            <Image className="w-5 h-5 text-primary" />
          </label>
          <Smile className="w-5 h-5 text-primary" />
        </div>
        <Button isLoading={isPending} onClick={() => onSumbit()} disabled={textContent.length === 0} className="w-16">{buttonText}</Button>
        <span className="absolute left-0 border-t border-gray-300 border-solid w-full h-14 -z-10" />
      </div>
    </div>
  );
};
