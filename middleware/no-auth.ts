export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useUser()

  if (user.value) {
    console.log("user")
    console.log(user)
    return '/'
  }
  return true
})