import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder: "fresh-store-products",
    resource_type: "image",
    public_id: file.originalname.split(".")[0],
    format: "webp",
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  }),
});

export const upload = multer({ storage });
