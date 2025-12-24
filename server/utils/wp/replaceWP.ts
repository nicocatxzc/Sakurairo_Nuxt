const nuxtconfig = useRuntimeConfig();

export function replaceDomain(domain:string) {
  domain = domain.replace(nuxtconfig.wordpressURL,"")
  return domain
}