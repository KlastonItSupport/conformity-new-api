import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ContractsService } from '../services/contracts.service';
import { CreateContractDto } from '../dtos/create-contract.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAll(@Query() query, @Req() req) {
    return await this.contractsService.getAll(
      {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
        search: query.search ?? '',
      },
      req.user.companyId,
      req.user.id,
    );
  }

  @Post()
  async createContract(@Body() createContractDto: CreateContractDto) {
    return await this.contractsService.createContract(createContractDto);
  }

  @Delete(':id')
  async deleteContract(@Param('id') id: number) {
    return await this.contractsService.deleteContract(id);
  }

  @Patch(':id')
  async editContract(@Param('id') id: number, @Body() data: CreateContractDto) {
    return await this.contractsService.editContract(id, data);
  }
}