import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/zh';
import 'dayjs/locale/en';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);

/**
 * 将GMT时间转换为服务端时区的本地化时间对象
 */
export default function getLocalTime(time:string) {

    const browserLocale = navigator?.language ?? 'zh-CN';

    dayjs.locale(browserLocale.toLowerCase());
    
    const sysConfig = useSysConfig()
    const serverTimezone = sysConfig.value?.time_zone || "Asia/Shanghai";

    const rawTime = dayjs(time);
    const timeInOriginalZone = rawTime.tz(serverTimezone);
    const localTime = timeInOriginalZone.local();

    return localTime;
}
