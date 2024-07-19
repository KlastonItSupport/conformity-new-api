import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OriginsServices } from '../services/origins.services';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('origins')
export class OriginsController {
  constructor(private readonly originsService: OriginsServices) {}

  @Get()
  @UseGuards(AuthGuard)
  getOrigins(@Req() req) {
    return this.originsService.getOrigins(req.user.companyId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createOrigin(@Body() data, @Req() req) {
    return this.originsService.createOrigin(data.name, req.user.companyId);
  }
}
