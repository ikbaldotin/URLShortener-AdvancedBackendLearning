import { UrlRepository } from "./url.repository.js";
import { UrlService } from "./url.service.js";

const urlRepository = new UrlRepository();
const urlService = new UrlService(urlRepository);
export default urlService;
