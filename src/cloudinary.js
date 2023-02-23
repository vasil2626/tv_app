import { Cloudinary } from "@cloudinary/url-gen";
import { Resize } from "@cloudinary/url-gen/actions";

class CloudinaryService {
  getCloudinary() {
    return this.cloudinary;
  }

  getResize() {
    return new Resize();
  }

  getCloudinaryUrl(image, width, height) {
    const cldInstance = new Cloudinary({ cloud: { cloudName: "drmo72zdk" } });

    const myImage = cldInstance
      .image(image)
      .setDeliveryType("fetch")
      .resize(Resize.fill().width(250).height(348));

    return myImage.toURL();
  }
}

export default CloudinaryService;
