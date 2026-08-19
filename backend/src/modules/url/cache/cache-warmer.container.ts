import { UrlRepository } from "../url.repository.js";
import { CacheWarmerService } from "./cache-warmer.service.js";

const urlRepsitory = new UrlRepository();
const cacheWarmerService = new CacheWarmerService(urlRepsitory);
export default cacheWarmerService;
