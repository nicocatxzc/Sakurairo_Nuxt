/**
 * 返回结果带优化参数的nuxtImg
 */
export default function (url:string) {
    try {
        const img = useImage()
        const nuxtImg = img(url,{quality:100,format:"webp"})
        return nuxtImg;
    } catch {
        console.error("非法的图像地址:",url)
    }
}
