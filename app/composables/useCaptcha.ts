export const useCaptcha = () => {
    async function get() {
        const res = await $fetch('/api/auth/captcha')
        return res
    }
    async function verify(answer:string,token:string,hash:string) {
        const res = await $fetch('/api/auth/captcha',{
            method:"POST",
            body: {
                token,
                hash,
                answer
            }
        })
        return res
    }
    return {
        get,verify
    }
};
