import { http } from '@kit.NetworkKit';
import { Constants } from './Constants';
import { hilog } from '@kit.PerformanceAnalysisKit';


export class Request {
  static httpRequest = http.createHttp();

  static get<T>(url: string): Promise<T> {
    if(!url.startsWith('https')) {
      url = `${Constants.API_GATEWAY}/${url}`
    }
    hilog.debug(0x0000, '[MOVIE_SHOWING]', '[GET]%s', url)
    return Request.httpRequest.request(url, {
      method: http.RequestMethod.GET
    }).then((value: http.HttpResponse) => {
      hilog.debug(0x0000, '[MOVIE_SHOWING]', '[RESPONSE][%s]:%s', url, value.result)
      let result: T = JSON.parse(value.result as string)
      return Promise.resolve(result);
    })
  }
}