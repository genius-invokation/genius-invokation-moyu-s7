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

import {
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto, UsersService, type UserInfo } from "./users.service";
import { User } from "../auth/user.decorator";
import { Public } from "../auth/auth.guard";

@Controller("users")
export class UsersController {
  constructor(private users: UsersService) {}

  @Get("me")
  @Public()
  async me(@User() userId: number | null): Promise<UserInfo | null> {
    if (userId === null) {
      return null;
    }
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Get(":id")
  async getUser(@Param("id", ParseIntPipe) id: number): Promise<UserInfo> {
    const user = await this.users.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Post()
  @Public()
  async createUser(
    @Headers("Authorization") auth: string,
    @Body() body: CreateUserDto,
  ): Promise<UserInfo> {
    if (auth !== `Bearer ${import.meta.env.ADMIN_PASSWORD}`) {
      throw new UnauthorizedException("No permission to create user");
    }
    await this.users.createUser(body);
    return (await this.users.findById(body.id))!;
  }
}
