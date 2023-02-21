import { InmateRequest, InmateQuery, Inmate } from "~~/interfaces/inmates";

export default () => {
  const { $fetch } = useNuxtApp();
  const config = useRuntimeConfig();

  const inmates = useState("inmates", () => null);
  const logs = useState("logs", () => null);
  const loading = useState<boolean>("inmates-loading", () => false);
  const query = useState<InmateQuery>("inmates-query", () => {
    return {
      category: "all",
      start_date: null,
      end_date: null,
      skip: 0,
      limit: 0,
    };
  });

  const addInmate = async (payload: InmateRequest): Promise<string> => {
    try {
      const registration = payload.registration;
      const response: Response = await $fetch(
        `${config.public.apiBase}/inmates`,
        "post",
        JSON.stringify({
          registration: payload.registration,
          name: payload.name,
          alias: payload.alias,
          category: payload.category,
          NIK: payload.NIK,
          place_of_birth: payload.place_of_birth,
          date_of_birth: payload.date_of_birth,
          date_inside: payload.date_inside,
          address: payload.address,
          notes: payload.notes,
          city: payload.city,
          district: payload.district,
          sex: payload.sex,
        })
      );

      console.log("add Inmate : payload");
      console.log(payload);

      if (response.status !== 201) throw new Error("");
      const result: string = await response.text();
      if (result && payload.file.length) {
        const data: FormData = new FormData();
        for (let i: number = 0; i < payload.file.length; i++) {
          data.append("image", payload.file[i]);
        }
        await $fetch(
          `${config.public.apiBase}/inmates/image/${result}`,
          "put",
          data
        );
      }
      await $fetch(
        `${config.public.apiBase}/logs`,
        "post",
        JSON.stringify({
          registration: registration,
          type: "add",
        })
      );
      return result;
    } catch (e) {
      return null;
    }
  };
  const updateInmate = async (
    payload: InmateRequest,
    dataUpdate: boolean,
    imageUpdate: boolean
  ): Promise<string> => {
    try {
      const registration = payload.registration;
      var result: string = "";
      console.log("payload");
      console.log(payload);
      if (dataUpdate) {
        const response: Response = await $fetch(
          `${config.public.apiBase}/inmates/${payload._id}`,
          "put",
          JSON.stringify({
            _id: payload._id,
            registration: payload.registration,
            name: payload.name,
            alias: payload.alias,
            category: payload.category,
            NIK: payload.NIK,
            place_of_birth: payload.place_of_birth,
            date_of_birth: payload.date_of_birth,
            date_inside: payload.date_inside,
            address: payload.address,
            notes: payload.notes,
            city: payload.city,
            district: payload.district,
            sex: payload.sex,
          })
        );
        if (response.status !== 200) throw new Error("");
      }
      if (imageUpdate) {
        const data: FormData = new FormData();
        for (let i: number = 0; i < payload.file.length; i++) {
          data.append("image", payload.file[i]);
        }
        data.append("file_delete", JSON.stringify(payload.file_delete));
        await $fetch(
          `${config.public.apiBase}/inmates/image/${payload._id}`,
          "put",
          data
        );
      }
      await $fetch(
        `${config.public.apiBase}/logs`,
        "post",
        JSON.stringify({
          type: "update",
          registration: payload.registration,
        })
      );
      return "result";
    } catch (e) {
      return null;
    }
  };
  const deleteInmate = async (payload): Promise<string> => {
    try {
      console.log("payload");
      console.log(payload);
      const registration = payload.registration;
      const response: Response = await $fetch(
        `${config.public.apiBase}/inmates/delete/${payload._id}`,
        "put",
        JSON.stringify({
          _id: payload._id,
          email: payload.email,
          password: payload.password,
        })
      );
      if (response.status !== 200) throw new Error("");
      // console.log(response);
      const result = await response;
      console.log(result);
      if (result) {
        await $fetch(
          `${config.public.apiBase}/logs`,
          "post",
          JSON.stringify({
            registration: registration,
            type: "delete",
          })
        );
      }
      return "SUCCESS";
    } catch (e) {
      console.log(e);
      return "FAILED";
    }
  };
  const getInmates = async (text?: string) => {
    try {
      const urlString: string = `${config.public.apiBase}/inmates?${
        text ? `text=${text}&` : ""
      }${
        query.value.category !== "all"
          ? `category=${query.value.category}&`
          : ""
      }${
        query.value.start_date ? `start_date=${query.value.start_date}&` : ""
      }${query.value.end_date ? `end_date=${query.value.end_date}&` : ""}${
        query.value.skip ? `skip=${query.value.skip}&` : ""
      }${query.value.limit ? `limit=${query.value.limit}&` : ""}`;
      const response: Response = await $fetch(urlString, "get");
      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      if (result) inmates.value = [];
      return (inmates.value = result);
    } catch (e) {
      return null;
    }
  };
  const getInmateDetails = async (id: string) => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/inmates/${id}`,
        "get"
      );
      if (response.status !== 200) throw new Error("");
      const result = await response.json();
      // console.log(result);
      return result;
    } catch (e) {
      return null;
    }
  };
  const getInmatesOverview = async () => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/inmates/overview`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      return result;
    } catch (e) {
      return null;
    }
  };
  const getLogs = async () => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/logs`,
        "get"
      );
      if (response.status !== 200) throw new Error("");
      const result = await response.json();
      return (logs.value = result);
    } catch (e) {
      return null;
    }
  };

  return {
    logs,
    inmates,
    loading,
    query,
    getLogs,
    addInmate,
    getInmates,
    updateInmate,
    deleteInmate,
    getInmateDetails,
    getInmatesOverview,
  };
};
