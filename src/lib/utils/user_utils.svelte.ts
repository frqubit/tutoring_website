import { browser } from "$app/environment";
import { DeFailure, SerFailure } from "$lib/backend/utils/serde_utils";
import {
  LatestVersion as LatestUserInfoVersion,
  type LatestFormat as LatestUserInfoFormat,
  AnyVersion as AnyUserInfoVersion,
} from "$lib/backend/webdata/user_info";
import { AuthFetcher, FetcherWithDefaultClientSettings } from "$lib/fetchers";

class UserInfoCls {
  value = $state() as LatestUserInfoFormat | null;

  private constructor() {
    this.value = null;

    if (browser) {
      const item = localStorage.getItem("tuserinfo");
      if (item) {
        const localVal = AnyUserInfoVersion.de(item);
        if (localVal instanceof DeFailure) {
          console.error(`LocalStorage value invalid: ${localVal.reason}`);
        } else {
          const any_version_val = localVal;

          if ("is_administrator" in any_version_val) {
            this.value = any_version_val;
          } else {
            // Just reset the key at this point, this is V1
            this.value = null;
          }
        }
      }
    }

    $effect(() => {
      if (this.value != null) {
        const serialized = AnyUserInfoVersion.ser(this.value);
        if (serialized instanceof SerFailure) {
          console.error(
            `Current value invalid userinfocls: ${serialized.reason}`,
          );
        } else {
          localStorage.setItem("tuserinfo", serialized);
        }
      }
    });
  }

  public static async create(): Promise<UserInfoCls> {
    const info = new UserInfoCls();

    if (browser) {
      if (info.value) {
        if (info.value.expires.getTime() < Date.now()) {
          info.value = null;
        }
      }

      if (info.value == null) {
        try {
          const authFetcher = FetcherWithDefaultClientSettings(AuthFetcher);
          const res = await authFetcher.GetMyUserInfo({});

          if (res) {
            info.value = res;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    return info;
  }
}

export async function localUserInfo() {
  return UserInfoCls.create();
}
