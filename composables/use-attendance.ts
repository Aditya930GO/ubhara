// import { Product, ProductMin, ProductRequest, ProductQuery } from "~~/interfaces/product"
// import { ProductStockRequest } from "~~/interfaces/product-stock"

export default () => {
  const { $fetch } = useNuxtApp();
  const config = useRuntimeConfig();

  const attendances = useState("classes", () => null);

  const loading = useState<boolean>("products-loading", () => false);
  const query = useState("products-query", () => {
    return {
      sort: "name-ascending",
      skip: 0,
      limit: 0,
    };
  });

  const addAttendance = async (payload): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/attendances`,
        "post",
        JSON.stringify({
          class_id: payload.class_id,
          // date: payload.date,
          add_attendance: payload.add_attendance,
        })
      );
      if (response.status !== 201) throw new Error("");

      const result: string = await response.text();
      console.log(result);
      return result;
    } catch (e) {
      return null;
    }
  };

  const updateClass = async (payload, dataUpdate: boolean): Promise<string> => {
    try {
      if (dataUpdate) {
        const response: Response = await $fetch(
          `${config.public.apiBase}/attendances/${payload._id}`,
          "put",
          JSON.stringify({
            name: payload.name,
            tags: payload.tags,
            schedule: payload.schedule,
            notes: payload.notes,
          })
        );
        if (response.status !== 200) throw new Error("");
      }
      return payload._id;
    } catch (e) {
      return null;
    }
  };

  const getAttendances = async (payload) => {
    try {
      const urlString: string = `${config.public.apiBase}/attendances/${payload}`;
      const response: Response = await $fetch(urlString, "get");
      if (response.status !== 200) throw new Error("");
      const result: [] = await response.json();
      console.log("result di use attendances");
      console.log(payload);
      console.log(result);
      // attendances.value = result
      return (attendances.value = result);
    } catch (e) {
      return null;
    }
  };

  const getAttendanceDetails = async (id: string) => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/attendances/${id}`,
        "get"
      );
      if (response.status !== 200) throw new Error("");
      const result = await response.json();
      console.log(result);
      return result;
    } catch (e) {
      return null;
    }
  };
  const openClassAttendance = async (id: string): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/attendances/${id}`,
        "put"
      );
      if (response.status !== 200) throw new Error("");
      const result = await response.json();
      console.log(result);
      return result;
    } catch (e) {
      return null;
    }
  };
  const submitAttendance = async (id: string): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/attendances/attend/${id}`,
        "put"
      );
      if (response.status !== 200) throw new Error("");
      const result: string = await response.text();
      console.log(result);
      return result;
    } catch (e) {
      return e;
    }
  };

  return {
    attendances,
    loading,
    query,
    submitAttendance,
    openClassAttendance,
    addAttendance,
    updateClass,
    getAttendances,
    getAttendanceDetails,
  };
};
