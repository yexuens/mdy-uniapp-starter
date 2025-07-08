import {defineStore} from "pinia";
import {getBrandInfo} from "@/api";

interface IBrandInfo {
  address: string;
  addressTwo: string;
  brandId: number;
  expireTime: string;
  id: number;
  joinStatus: number;
  joinTime: string;
  logo: string;
  openTime: string;
  overTime: string;
  phone: string;
  positionLatitude: string;
  positionLongitude: string;
  remarks: string;
  shopowner: string;
  status: number;
  storeExchangeCode: string;
  storeName: string;
  storePeople: number;
  storeQrcodeImage: string;
  storeQrcodeUrl: string;
  userid: number;
  wxhao: string;
}

const initialStore: IBrandInfo = {
  address: "",
  addressTwo: "",
  brandId: 0,
  expireTime: "",
  id: 0,
  joinStatus: 0,
  joinTime: "",
  logo: "",
  openTime: "",
  overTime: "",
  phone: "",
  positionLatitude: "",
  positionLongitude: "",
  remarks: "",
  shopowner: "",
  status: 0,
  storeExchangeCode: "",
  storeName: "",
  storePeople: 0,
  storeQrcodeImage: "",
  storeQrcodeUrl: "",
  userid: 0,
  wxhao: "",
};
export const useBrandStore = defineStore(
  'brand',
  () => {
    const brandInfo = ref<IBrandInfo>(initialStore)


    async function updateBrand() {
      const {record, code} = await getBrandInfo()
      if (code === 1)
        brandInfo.value = {
          ...record as unknown as IBrandInfo
        }
    }

    return {
      brandInfo,
      updateBrand,
    }
  })
