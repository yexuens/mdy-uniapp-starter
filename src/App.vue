<script setup lang="ts">
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import {useBrandStore, useUserStore} from "@/store";

const user = useUserStore()
const brand = useBrandStore()
onLaunch(async () => {
  await user.updateUser()
  await brand.updateBrand()
})
</script>

<style>
view, text, image, button, input, textarea {
  box-sizing: border-box;
  font-size: 28rpx;
}

button::after {
  border: 0;
}
</style>
