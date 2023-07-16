import { CookieRef } from "nuxt/dist/app/composables";
import { User, UserRequest } from "~~/interfaces/user";

export default () => {
  const { $setDefaults, $fetch } = useNuxtApp();
  const config = useRuntimeConfig();
  const atkCookie: CookieRef<string> = useCookie<string>("atk", {
    maxAge: 1800,
  });
  const rtkCookie: CookieRef<string> = useCookie<string>("rtk", {
    maxAge: 86400,
  });
  let usersData = [];
  const user = useState<User>("user", () => null);
  const users = useState<User[]>("users", () => null);
  const students = useState<User[]>("students", () => null);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/users/login`,
        "post",
        JSON.stringify({ email, password })
      );
      const result: { atk: string; rtk: string; user: User } =
        await response.json();
      if (!result.atk || !result.rtk) throw new Error("");
      atkCookie.value = result.atk;
      rtkCookie.value = result.rtk;
      $setDefaults({
        headers: {
          Authorization: `Bearer ${result.atk}`,
        },
      });
      user.value = result.user;
      return result.user;
    } catch {
      return null;
    }
  };
  const signup = async (
    email: string,
    password: string,
    nim: string,
    uname: string,
    name: string
  ): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/users`,
        "post",
        JSON.stringify({ email, password, nim, username: uname, name })
      );
      const results: string = await response.text();
      console.log(results);
      return results;
    } catch {
      return null;
    }
  };
  const enrollClass = async (class_id: string): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/users/enroll`,
        "put",
        JSON.stringify({ class_id })
      );
      const results: string = await response.text();
      console.log("results enroll");
      console.log(results);
      return results;
    } catch {
      return null;
    }
  };
  const getUsers = async (): Promise<User[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/users`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result: User[] = await response.json();
      users.value = result;
      // console.log(result);
      usersData = result;
      return result;
    } catch (e) {
      return null;
    }
  };
  const getStudent = async (payload): Promise<User[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/users/${payload}`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result: User[] = await response.json();
      console.log("result get by class");
      console.log(result);
      users.value = result;
      students.value = result;
      usersData = result;
      return result;
    } catch (e) {
      return null;
    }
  };

  const updateUser = async (payload: UserRequest): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/users/${payload._id}`,
        "put",
        JSON.stringify({
          // role_id: payload.role_id,
          // branch_id: payload.branch_id,
          name: payload.name,
          email: payload.email,
          password: payload.password,
          old_password: payload.old_password,
          // birth_date: payload.birth_date,
          // phone: payload.phone,
        })
      );

      console.log("response");
      console.log(response);
      console.log("response.text()");
      console.log(response.text() + "sad");
      if (response.status !== 201) {
        throw new Error("");
      } else {
        await $fetch(
          `${config.public.apiBase}/logs`,
          "post",
          JSON.stringify({
            registration: "-",
            type: "password",
          })
        );
      }
      return "SUCCESS";
    } catch (e) {
      console.log("e");
      console.log(e);
      return "INVALID";
    }
  };
  const refresh = async (): Promise<User> => {
    try {
      if (!rtkCookie.value) throw new Error("");
      const response: Response = await $fetch(
        `${config.public.apiBase}/users/refresh-token`,
        "post",
        JSON.stringify({ rtk: rtkCookie.value })
      );
      const result: { atk: string; rtk: string; user: User } =
        await response.json();
      if (!result.atk || !result.rtk) throw new Error("");
      atkCookie.value = result.atk;
      rtkCookie.value = result.rtk;
      $setDefaults({
        headers: {
          Authorization: `Bearer ${result.atk}`,
        },
      });
      user.value = result.user;
      return result.user;
    } catch {
      logout();
      return null;
    }
  };

  const logout = (): void => {
    atkCookie.value = "";
    rtkCookie.value = "";
    $setDefaults({
      headers: {
        Authorization: null,
      },
    });
    user.value = null;
  };

  return {
    students,
    user,
    users,
    usersData,
    getStudent,
    updateUser,
    login,
    logout,
    refresh,
    signup,
    enrollClass,
    getUsers,
  };
};
