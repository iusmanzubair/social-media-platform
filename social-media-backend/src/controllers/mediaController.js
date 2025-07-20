import { s3 } from "../config/aws-s3.js";
import dotenv from "dotenv"

dotenv.config()

export const generateSignedUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({
        success: false,
        message: "Unable to process request"
      })
    }

    const fileKey = `posts/${Date.now()}-${fileName}`

    const uploadUrl = await s3.getSignedUrlPromise('putObject', {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
      Expires: 5 * 60,
      ACL: 'public-read'
    })

    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`

    res.status(200).json({
      success: true,
      uploadUrl,
      fileUrl
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Error generating signed Url"
    })
  }
};
