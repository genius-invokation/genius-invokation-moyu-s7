// Copyright (C) 2024-2025 Guyutongxue
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { createSignal } from "solid-js";
import { GITHUB_AUTH_REDIRECT_URL } from "../config";
import { useAuth } from "../auth";
import axios, { AxiosError } from "axios";

export function Login() {
  const CLIENT_ID = "Iv23liMGX6EkkrfUax8B";
  const REDIRECT_URL = encodeURIComponent(GITHUB_AUTH_REDIRECT_URL);
  const { loginGuest, refresh } = useAuth();

  const showGuestHint = () => {
    window.alert(`报名结束后，我们将向参赛选手分发比赛账号；比赛账号只能使用报名时填写的单套牌组。
您可以使用游客模式进行练习和测试；在游客模式下：
- 您的牌组将保存在本地，不会在云端同步；
- 您的对局记录将不会在任何地方保存。`);
  };

  const [loginFormValid, setLoginFormValid] = createSignal(false);
  const [guestNameValid, setGuestNameValid] = createSignal(false);

  const login = async (e: SubmitEvent) => {
    e.preventDefault();
    const formEl = e.target as HTMLFormElement;
    const form = new FormData(formEl);
    const payload = {
      email: form.get("email"),
      password: form.get("password")
    };
    try {
      const { data } = await axios.post("/auth/login", payload);
      localStorage.setItem("accessToken", data.accessToken);
      await refresh();
    } catch (e) {
      if (e instanceof AxiosError) {
          alert(e.response?.data.message);
      }
      console.error(e);
    }
  };
  const validateLoginForm = (e: InputEvent) => {
    const formEl = e.target as HTMLFormElement;
    setLoginFormValid(formEl.checkValidity());
  };

  const guestLogin = async (e: SubmitEvent) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const name = form.get("guestName") as string;
    loginGuest(name);
  };

  return (
    <div class="w-80 flex flex-col items-stretch text-xl my-8 gap-10">
      <form class="flex flex-col" onSubmit={login} onInput={validateLoginForm}>
        <input
          type="text"
          class="input input-solid text-1rem rounded-lb-0 rounded-rb-0"
          name="email"
          placeholder="邮箱"
          inputmode="email"
          required
        />
        <input
          type="password"
          class="input input-solid text-1rem rounded-lt-0 rounded-rt-0"
          name="password"
          placeholder="密码"
          inputmode="text"
          required
        />
        <button
          type="submit"
          class="flex-shrink-0 mt-3 btn btn-solid-green "
          disabled={!loginFormValid()}
        >
          选手登录
        </button>
      </form>
      <hr />
      <div class="flex flex-col gap-1">
        <p class="text-gray-500 text-sm">
          或者以{" "}
          <span class="text-blue-400 cursor-pointer" onClick={showGuestHint}>
            游客身份
          </span>{" "}
          继续……
        </p>
        <form class="flex flex-row items-stretch" onSubmit={guestLogin}>
          <input
            type="text"
            class="input input-solid rounded-r-0 b-r-0 h-2.2rem text-1rem"
            name="guestName"
            maxLength={64}
            placeholder="起一个响亮的名字吧！"
            pattern=".*[^\s].*"
            onInput={(e) => setGuestNameValid(e.target.checkValidity())}
            autofocus
            required
          />
          <button
            type="submit"
            class="flex-shrink-0 btn btn-solid rounded-l-0 h-2.2rem text-1rem"
            disabled={!guestNameValid()}
          >
            <span>确认</span>
          </button>
        </form>
      </div>
    </div>
  );
}
