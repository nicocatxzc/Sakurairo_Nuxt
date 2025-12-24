export default async function() {
  let res = await useWP.get("/wp-json/hachimi/v1/settings")

  return res.data;
}