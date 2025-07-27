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
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";
import { IsNotEmpty } from "class-validator";
import { AuthService } from "./auth.service";
import { Public } from "./auth.guard";

class LoginRequestDto {
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;
}

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("login")
  @Public()
  login(@Body() body: LoginRequestDto) {
    return this.auth.login(body.email, body.password);
  }
}
