import { User, UserMin, UserOverview, UserRequest } from "~~/interfaces/user";
import { UserRole, UserRoleRequest } from "~~/interfaces/user-role";

export default () => {
  const { $fetch } = useNuxtApp();
  const config = useRuntimeConfig();

  const employees = useState<UserMin[]>("employees", () => null);
  const roles = useState<UserRole[]>("employees-roles", () => null);

  const getEmployees = async (): Promise<UserMin[]> => {
    try {
      console.log("getEmployees begin")
      const response: Response = await $fetch(
        `${config.public.apiBase}/users`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result: UserMin[] = await response.json();
      console.log(result)
      employees.value = result;
      return result;
    } catch (e) {
      return null;
    }
  };

  const getEmployeesOverview = async (): Promise<UserOverview[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/users/overview`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result: UserOverview[] = await response.json();
      return result;
    } catch (e) {
      return null;
    }
  };

  const getEmployeesRoles = async (): Promise<UserRole[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/user-roles`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result: UserRole[] = await response.json();

      roles.value = result;
      return result;
    } catch (e) {
      return null;
    }
  };

  // const addEmployees = async (payload: UserRequest): Promise<string> => {
  //   try {
  //     const response: Response = await $fetch(
  //       `${config.public.apiBase}/users`,
  //       "post",
  //       JSON.stringify({
  //         role_id: payload.role_id,
  //         branch_id: payload.branch_id,
  //         name: payload.name,
  //         email: payload.email,
  //         password: payload.password,
  //         birth_date: payload.birth_date,
  //         phone: payload.phone,
  //       })
  //     );
  //     if (response.status !== 201) throw new Error("");

  //     const result: string = await response.text();
  //     if (result && payload.file) {
  //       const data: FormData = new FormData();
  //       data.append("image", payload.file);
  //       await $fetch(
  //         `${config.public.apiBase}/users/image/${result}`,
  //         "put",
  //         data
  //       );
  //     }

  //     return result;
  //   } catch (e) {
  //     return null;
  //   }
  // };

  const addEmployeesRoles = async (
    payload: UserRoleRequest
  ): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/user-roles`,
        "post",
        JSON.stringify({
          name: payload.name,
          color: payload.color,
          action: payload.action,
        })
      );
      if (response.status !== 201) throw new Error("");

      const result: string = await response.text();
      return result;
    } catch (e) {
      return null;
    }
  };
  const updateEmployees = async (payload: UserRequest): Promise<string> => {
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

  return {
    employees,
    roles,
    updateEmployees,
    getEmployees,
    getEmployeesOverview,
    getEmployeesRoles,
    // addEmployees,
    addEmployeesRoles,
  };
};
