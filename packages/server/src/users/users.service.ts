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

import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../db/prisma.service";
import { hash } from "node:crypto";
import { IsEmail, MaxLength, MinLength } from "class-validator";

export interface UserInfo {
  id: number;
  login: string;
  name?: string;
  avatarUrl: string;
}

export class CreateUserDto {
  id!: number;

  @MinLength(1)
  @MaxLength(16)
  name!: string;

  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private logger = new Logger(UsersService.name);

  async findByEmailAndVerify(
    email: string,
    password: string,
  ): Promise<UserInfo | null> {
    const user = await this.prisma.user.findFirst({
      where: { email, password: hash("sha256", password, "buffer") },
    });
    if (!user) {
      return null;
    }
    const sha = hash("md5", user.email, "hex");
    const avatarUrl = `https://cn.cravatar.com/avatar/${sha}?s=200&d=identicon`;
    return {
      id: user.id,
      login: user.name,
      name: user.name,
      avatarUrl,
    };
  }

  async findById(id: number): Promise<UserInfo | null> {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });
    if (!user) {
      return null;
    }
    const sha = hash("md5", user.email, "hex");
    const avatarUrl = `https://cn.cravatar.com/avatar/${sha}?s=200&d=identicon`;
    return {
      id: user.id,
      login: user.name,
      name: user.name,
      avatarUrl,
    };
  }

  async createUser(dto: CreateUserDto) {
    await this.prisma.user.create({
      data: {
        id: dto.id,
        name: dto.name,
        email: dto.email,
        password: hash("sha256", dto.password, "buffer"),
      },
    });
  }
}
